const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Highly sophisticated local resume text parser.
 * Extracts CGPA, Branch, Backlogs, and Key Skills using high-precision regex.
 * 
 * @param {string} text - Raw text content extracted from the resume PDF
 * @returns {object} Extracted credentials
 */
const parseResumeTextLocally = (text) => {
  // Normalize whitespaces and line endings for uniform matching
  const cleanText = text.replace(/\s+/g, ' ');

  // 1. CGPA Extraction
  let cgpa = 8.0; // Default fallback
  let cgpaFound = false;

  // Pattern A: Fraction pattern (e.g. "6.93/10", "8.4 / 10", "9.2/10.0")
  const fractionPattern = /\b([0-9]\.[0-9]{1,3})\s*\/\s*10(?:\.0)?\b/i;
  // Pattern B: Labeled pattern (e.g. "CGPA: 6.93", "CGPA - 8.4", "Pointer - 9.1", "GPA of 3.8")
  const labeledPattern = /(?:cgpa|gpa|pointer|cpi|c\.g\.p\.a|grade\s*point\s*average)\s*(?:of|is)?\s*[:\-]?\s*\b([0-9]\.[0-9]{1,3})\b/i;
  // Pattern C: Suffix pattern (e.g. "6.93 CGPA", "8.4 Pointer")
  const suffixPattern = /\b([0-9]\.[0-9]{1,3})\s*(?:cgpa|gpa|pointer|cpi)\b/i;
  // Pattern D: Context-based check (decimal numbers between 4.0 and 10.0 near academic keywords)
  const contextPattern = /(?:cgpa|gpa|score|academic|education|percentage|pointer|cpi|grades?|marks?|b\.tech|m\.tech|b\.e|b\.sc|m\.sc|graduation).{1,50}\b([4-9]\.[0-9]{1,3})\b/i;

  let match = cleanText.match(fractionPattern);
  if (match) {
    cgpa = parseFloat(match[1]);
    cgpaFound = true;
  } else {
    match = cleanText.match(labeledPattern);
    if (match) {
      cgpa = parseFloat(match[1]);
      cgpaFound = true;
    } else {
      match = cleanText.match(suffixPattern);
      if (match) {
        cgpa = parseFloat(match[1]);
        cgpaFound = true;
      } else {
        match = cleanText.match(contextPattern);
        if (match) {
          cgpa = parseFloat(match[1]);
          cgpaFound = true;
        }
      }
    }
  }

  // Double check constraints
  if (cgpa < 0) cgpa = 0;
  if (cgpa > 10) cgpa = 10;
  cgpa = Math.round(cgpa * 100) / 100; // Format to 2 decimal places

  // 2. Branch Extraction
  let branch = 'CSE'; // Default
  const lowerText = cleanText.toLowerCase();

  const branchMappings = [
    { keywords: ['computer science', 'cse', 'compsci', 'computer engineering'], value: 'CSE' },
    { keywords: ['information technology', 'it branch', 'infotech'], value: 'IT' },
    { keywords: ['electronics', 'ece', 'telecommunication', 'extc'], value: 'ECE' },
    { keywords: ['electrical', 'eee'], value: 'EEE' },
    { keywords: ['mechanical', 'prod', 'automobile'], value: 'Mechanical' },
    { keywords: ['civil engineering', 'civil dept'], value: 'Civil' },
    { keywords: ['chemical engineering', 'chem eng'], value: 'Chemical' }
  ];

  for (const mapping of branchMappings) {
    const found = mapping.keywords.some(keyword => {
      const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      return regex.test(lowerText);
    });
    if (found) {
      branch = mapping.value;
      break;
    }
  }

  // 3. Backlogs Extraction
  let backlogs = 0;
  // Look for phrases like "backlogs: 0", "active backlogs: 1", "0 backlogs"
  const backlogPattern1 = /(?:backlog|active backlog)[s]?\s*[:\-]?\s*\b([0-9]+)\b/i;
  const backlogPattern2 = /\b([0-9]+)\s*(?:active\s*)?backlog[s]?\b/i;

  let backlogMatch = cleanText.match(backlogPattern1);
  if (backlogMatch) {
    backlogs = parseInt(backlogMatch[1], 10);
  } else {
    backlogMatch = cleanText.match(backlogPattern2);
    if (backlogMatch) {
      backlogs = parseInt(backlogMatch[1], 10);
    }
  }

  // 4. Skills Extraction
  const knownSkills = [
    'React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'TypeScript', 'Python',
    'Java', 'C++', 'SQL', 'HTML', 'CSS', 'Redux', 'Tailwind', 'Git', 'GitHub',
    'Docker', 'AWS', 'DSA', 'REST APIs', 'System Design', 'Agile', 'Scrum'
  ];

  const extractedSkills = [];
  knownSkills.forEach(skill => {
    const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let regex;

    if (skill.endsWith('.js')) {
      const base = skill.slice(0, -3);
      regex = new RegExp(`\\b${base}(\\.js)?\\b`, 'i');
    } else if (skill === 'C++') {
      regex = new RegExp('c\\+\\+', 'i');
    } else {
      regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    }

    if (regex.test(cleanText)) {
      extractedSkills.push(skill);
    }
  });

  // Fallback skills if none matched
  if (extractedSkills.length === 0) {
    extractedSkills.push('React', 'Node.js', 'SQL', 'Python');
  }

  return {
    cgpa,
    branch,
    backlogs,
    skills: extractedSkills
  };
};

/**
 * Main parser entry point. Uses Gemini model if API key is present,
 * otherwise falls back to local regex extraction.
 */
const parseResumeText = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      console.log('Gemini API key detected, running advanced generative analysis...');
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-1.5-flash which is standard and fast
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        You are an ATS Resume parser. Parse the following resume text and extract these details:
        1. CGPA: A decimal number between 0 and 10 representing academic performance (e.g. 6.93 or 8.4). Default to 8.0 if not found.
        2. Branch: The field/department of study (e.g., 'CSE', 'IT', 'ECE', 'Mechanical', 'Civil', 'Chemical', etc.).
        3. Backlogs: Number of active backlogs as an integer. Default to 0 if not found.
        4. Skills: A list of relevant key technologies/skills found in the text (e.g. ['React.js', 'Node.js', 'Python']).

        Return ONLY a raw, valid JSON object containing exactly these keys: "cgpa", "branch", "backlogs", "skills".
        Do not include markdown tags like \`\`\`json or any other text before/after the JSON.

        Resume Text:
        ${text}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let jsonText = response.text().trim();

      // Clean up markdown block wraps if Gemini added them despite instructions
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }

      const parsed = JSON.parse(jsonText);

      // Validate schema and types before returning
      const cgpa = typeof parsed.cgpa === 'number' ? parsed.cgpa : parseFloat(parsed.cgpa) || 8.0;
      const backlogs = typeof parsed.backlogs === 'number' ? parsed.backlogs : parseInt(parsed.backlogs, 10) || 0;
      const branch = parsed.branch || 'CSE';
      const skills = Array.isArray(parsed.skills) ? parsed.skills : [];

      return {
        cgpa: Math.min(Math.max(cgpa, 0), 10),
        branch,
        backlogs: Math.max(backlogs, 0),
        skills: skills.length > 0 ? skills : ['React', 'Node.js']
      };
    } catch (error) {
      console.error('Gemini parsing failed, falling back to regex parser:', error);
      return parseResumeTextLocally(text);
    }
  } else {
    console.log('No Gemini API key configured. Utilizing local regex parsing engine.');
    return parseResumeTextLocally(text);
  }
};

module.exports = {
  parseResumeText,
  parseResumeTextLocally
};
