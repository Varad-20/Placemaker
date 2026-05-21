const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { PDFParse } = require('pdf-parse');
const { parseResumeText } = require('../utils/resumeParser');

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretplacementorjwttoken12345!', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      college,
      branch,
      cgpa,
      skills,
      targetRole,
      graduationYear,
      backlogs,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      college,
      branch,
      cgpa,
      skills: skills || [],
      targetRole,
      graduationYear,
      backlogs: backlogs || 0,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      // Set cookie option (optional, but good practice)
      const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
      };

      res.cookie('token', token, options);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          branch: user.branch,
          cgpa: user.cgpa,
          skills: user.skills,
          targetRole: user.targetRole,
          graduationYear: user.graduationYear,
          role: user.role,
          placementReadinessScore: user.placementReadinessScore,
          atsScore: user.atsScore,
          avatar: user.avatar,
          resumeUrl: user.resumeUrl,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }

    // Check for user (include password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie('token', token, options);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        cgpa: user.cgpa,
        skills: user.skills,
        targetRole: user.targetRole,
        graduationYear: user.graduationYear,
        role: user.role,
        placementReadinessScore: user.placementReadinessScore,
        atsScore: user.atsScore,
        avatar: user.avatar,
        resumeUrl: user.resumeUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const fieldsToUpdate = [
      'name',
      'college',
      'branch',
      'cgpa',
      'skills',
      'targetRole',
      'graduationYear',
      'avatar',
      'backlogs',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Calculate dynamic ATS score: base of 40 + (found / total) * 45 + (CGPA / 10) * 15 - backlogs * 5
    const keywordsList = [
      { word: 'React.js', regex: /react/i },
      { word: 'Node.js', regex: /node/i },
      { word: 'REST APIs', regex: /rest|api/i },
      { word: 'MongoDB', regex: /mongo/i },
      { word: 'System Design', regex: /system/i },
      { word: 'Kubernetes', regex: /kubernetes|k8s/i },
      { word: 'TypeScript', regex: /typescript|ts/i },
      { word: 'Python', regex: /python/i },
      { word: 'CI/CD', regex: /ci\/cd|jenkins|actions/i },
      { word: 'Agile/Scrum', regex: /agile|scrum/i },
    ];

    let found = 0;
    keywordsList.forEach((kw) => {
      const isFound = user.skills.some(s => kw.regex.test(s));
      if (isFound) {
        found++;
      }
    });

    const total = keywordsList.length;
    const rawScore = Math.round(40 + (found / total) * 45 + (user.cgpa / 10) * 15 - user.backlogs * 5);
    const calculatedAtsScore = Math.max(0, Math.min(100, rawScore));

    user.atsScore = calculatedAtsScore;
    user.placementReadinessScore = Math.max(45, Math.min(100, Math.round(45 + (calculatedAtsScore * 0.4))));

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload & parse resume, then sync credentials
// @route   POST /api/auth/upload-resume
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF resume file.');
    }

    // Parse the PDF buffer using pdf-parse
    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    await parser.destroy(); // Always destroy to free memory
    const resumeText = pdfData.text;

    // Use our hybrid regex/Gemini parsing engine to extract credentials
    const extractedData = await parseResumeText(resumeText);

    // Find and update the user in the database
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update with extracted resume details
    user.cgpa = extractedData.cgpa;
    user.branch = extractedData.branch;
    user.backlogs = extractedData.backlogs;
    
    // Union / merge existing skills with newly extracted skills
    const mergedSkills = Array.from(new Set([...user.skills, ...extractedData.skills]));
    user.skills = mergedSkills;

    // Calculate dynamic ATS score: base of 40 + (found / total) * 45 + (CGPA / 10) * 15 - backlogs * 5
    const keywordsList = [
      { word: 'React.js', regex: /react/i },
      { word: 'Node.js', regex: /node/i },
      { word: 'REST APIs', regex: /rest|api/i },
      { word: 'MongoDB', regex: /mongo/i },
      { word: 'System Design', regex: /system/i },
      { word: 'Kubernetes', regex: /kubernetes|k8s/i },
      { word: 'TypeScript', regex: /typescript|ts/i },
      { word: 'Python', regex: /python/i },
      { word: 'CI/CD', regex: /ci\/cd|jenkins|actions/i },
      { word: 'Agile/Scrum', regex: /agile|scrum/i },
    ];

    let found = 0;
    keywordsList.forEach((kw) => {
      const isFound = mergedSkills.some(s => kw.regex.test(s));
      if (isFound) {
        found++;
      }
    });

    const total = keywordsList.length;
    const rawScore = Math.round(40 + (found / total) * 45 + (user.cgpa / 10) * 15 - user.backlogs * 5);
    const calculatedAtsScore = Math.max(0, Math.min(100, rawScore));

    user.atsScore = calculatedAtsScore;
    user.placementReadinessScore = Math.max(45, Math.min(100, Math.round(45 + (calculatedAtsScore * 0.4))));

    // Save the PDF file to backend/uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `resume-${user._id}-${Date.now()}.pdf`;
    const uploadPath = path.join(uploadsDir, filename);
    fs.writeFileSync(uploadPath, req.file.buffer);

    // Save relative static URL to DB
    user.resumeUrl = `/uploads/${filename}`;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: updatedUser,
      extractedData: {
        cgpa: extractedData.cgpa,
        branch: extractedData.branch,
        backlogs: extractedData.backlogs,
        skills: extractedData.skills
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadResume,
};
