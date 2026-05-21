import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import {
  Users, MessageSquare, ThumbsUp, PlusCircle, Search, X,
  Calendar, Send, MessageCircle
} from 'lucide-react';

const initialPosts = [
  {
    id: 1,
    author: 'Varad V.',
    role: 'Computer Science student',
    title: 'Google Interview Experience 2026 - Backend Systems Developer',
    category: 'Interview Experiences',
    content: 'Had 3 rounds of technical interviews. Primary focus areas were heavy graphs traversal algorithms and horizontal scaling setups. Be sure to study event loop queue delays!',
    upvotes: 42,
    comments: [
      { author: 'Ved G.', text: 'Super helpful details on the scaling questions!' },
      { author: 'Aryan S.', text: 'Did they ask about Redis caching buffers explicitly?' }
    ],
    hasUpvoted: false
  },
  {
    id: 2,
    author: 'Nikita K.',
    role: 'Fullstack Developer Alumni',
    title: 'Off-Campus Referral Openings at Zoho Corp!',
    category: 'Referral Leads',
    content: 'Zoho is actively hiring junior product engineers. Requirements: Java/OOPs core skills, relational DB schemas design, and basic algorithm solving speeds. Send resumes!',
    upvotes: 28,
    comments: [
      { author: 'Meera R.', text: 'Sent you my ATS-evaluated resume details on chat!' }
    ],
    hasUpvoted: false
  },
  {
    id: 3,
    author: 'Rohan P.',
    role: 'Electronics student',
    title: 'Curated 30-Day DSA Roadmap Review & Study Guides',
    category: 'Study Guides',
    content: 'Just wrapped the standard Arrays/Trees checklist paths. Highly recommend pairing it with direct practice links. Streaks keep the momentum solid.',
    upvotes: 19,
    comments: [],
    hasUpvoted: false
  }
];

const initialChats = [
  { id: 1, author: 'Ved G.', text: 'TCS Digital coding round was heavy on array manipulation. Practice subarray sums!', time: '10:32 AM', self: false },
  { id: 2, author: 'Aryan S.', text: 'Just completed Zoho round 1. They are focusing a lot on OOPs concepts and database schema design.', time: '10:35 AM', self: false },
  { id: 3, author: 'Nikita K.', text: 'Amazon off-campus links are active. Check the referrals stream!', time: '10:41 AM', self: false },
  { id: 4, author: 'Meera R.', text: 'Does Google ask about event loops or process scheduling in the systems developer track?', time: '10:43 AM', self: false }
];

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Interview Experiences');
  const [newContent, setNewContent] = useState('');

  // Expand comments drawer state
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Global Chat States
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const cached = localStorage.getItem('placement_community_posts');
    if (cached) {
      setPosts(JSON.parse(cached));
    } else {
      setPosts(initialPosts);
    }

    const cachedChats = localStorage.getItem('placement_global_chats');
    if (cachedChats) {
      setChatMessages(JSON.parse(cachedChats));
    } else {
      setChatMessages(initialChats);
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const savePosts = (updated) => {
    setPosts(updated);
    localStorage.setItem('placement_community_posts', JSON.stringify(updated));
  };

  const handleUpvote = (id) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          upvotes: p.hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          hasUpvoted: !p.hasUpvoted
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const handlePublishThread = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newPost = {
      id: Date.now(),
      author: user?.name || 'Anonymous User',
      role: user?.college || 'Placements Candidate',
      title: newTitle,
      category: newCategory,
      content: newContent,
      upvotes: 0,
      comments: [],
      hasUpvoted: false
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Reset forms
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const toggleComments = (id) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddComment = (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text) return;

    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { author: user?.name || 'Anonymous Peer', text }]
        };
      }
      return p;
    });
    savePosts(updated);

    // Reset comment inputs
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      author: user?.name || 'Varad V.',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    localStorage.setItem('placement_global_chats', JSON.stringify(updated));
    setChatInput('');

    // Simulated responses
    setTimeout(() => {
      const responses = [
        "Ved G.: Exactly! The patterns match what I saw.",
        "Aryan S.: Let me know if anyone wants to pair up for mock coding tests today.",
        "Nikita K.: Spot on feedback! Practice recursion and trees.",
        "Meera R.: Excellent information, thanks a lot for sharing everyone!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const [author, ...textParts] = randomResponse.split(':');
      const text = textParts.join(':').trim();

      setChatMessages(prev => {
        const next = [...prev, {
          id: Date.now() + 1,
          author: author.trim(),
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          self: false
        }];
        localStorage.setItem('placement_global_chats', JSON.stringify(next));
        return next;
      });
    }, 1500);
  };

  const categories = ['All', 'Interview Experiences', 'Referral Leads', 'Study Guides', 'Q&A'];

  const filteredPosts = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Users className="h-6 w-6 text-brand-500" /> Community Discussion Forum
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Interact with peers, share mock interviews, review referral listings, and align placement prep.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold px-4 py-2.5 shadow-md shadow-brand-500/20 transition-all text-xs animate-pulse-subtle"
          >
            <PlusCircle className="h-4.5 w-4.5" /> Start Thread
          </button>
        </div>

        {/* Categories Bar & Search */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition
                  ${activeCategory === cat
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-950 hover:border-slate-200 dark:hover:border-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussion threads..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 dark:focus:border-brand-400 transition"
            />
          </div>
        </div>

        {/* PRIMARY SPLITS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed listings */}
          <div className="lg:col-span-2 space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm space-y-4">
                {/* Author row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-brand-500 text-white font-extrabold flex items-center justify-center shrink-0">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 dark:text-white">{post.author}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{post.role}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800/80 uppercase">{post.category}</span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white leading-normal">{post.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>
                </div>

                {/* Interactions bar */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 dark:text-slate-500">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`inline-flex items-center gap-1.5 transition ${post.hasUpvoted ? 'text-brand-600 dark:text-brand-400' : 'hover:text-slate-600 dark:hover:text-slate-350'}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="inline-flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-355 transition"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                {/* Comments block (conditional) */}
                {expandedComments[post.id] && (
                  <div className="space-y-3.5 pt-3 border-t border-slate-100 dark:border-slate-850 animate-fade-in text-xs">
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2">
                      {post.comments.map((c, i) => (
                        <div key={i} className="p-3 bg-slate-50/70 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1">
                          <p className="font-extrabold text-slate-800 dark:text-white">{c.author}</p>
                          <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                        </div>
                      ))}
                      {post.comments.length === 0 && (
                        <p className="text-slate-400 dark:text-slate-500 italic text-[11px]">No feedback comments posted yet. Start the discussion below!</p>
                      )}
                    </div>

                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex items-center gap-2 pt-1">
                      <input
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Write a constructive comment..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 dark:focus:border-brand-400 transition"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold px-4 py-2 transition text-[11px]"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
                No active placement threads found. Launch a discussion using the "Start Thread" form.
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Calendar className="h-4.5 w-4.5 text-brand-500" /> Active drive notice
              </h4>
              <div className="space-y-3.5 text-xs">
                {[
                  { name: 'Google Off-Campus', date: 'Deadline: May 28, 2026' },
                  { name: 'Zoho Corporation', date: 'Date: June 02, 2026' }
                ].map((drive, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                    <p className="font-extrabold text-slate-800 dark:text-white">{drive.name}</p>
                    <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">{drive.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Placement Chat */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 shadow-sm overflow-hidden flex flex-col h-[480px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-855 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4.5 w-4.5 text-brand-500" />
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Global Placement Chat</h4>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">48 Online</span>
                </div>
              </div>

              {/* Messages Pane */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.self ? 'items-end' : 'items-start'} space-y-0.5`}>
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                      {msg.self ? 'You' : msg.author} · {msg.time}
                    </span>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[10px] leading-relaxed shadow-sm
                      ${msg.self
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-200/30 dark:border-slate-805'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Form Input */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 dark:border-slate-855 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-1.5 shrink-0">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask peers about placement rounds..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 dark:focus:border-brand-400 transition"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white transition shadow shadow-brand-500/10 animate-pulse-subtle"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Start Thread modal form */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 max-w-md w-full shadow-2xl overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900">
                <h4 className="text-sm font-black text-slate-800 dark:text-white">Publish Placement Discussion</h4>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handlePublishThread} className="p-6 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-600 dark:text-slate-300">Thread Title</label>
                  <input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Amazon interview experience..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3 outline-none focus:border-brand-500 dark:focus:border-brand-400 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-600 dark:text-slate-300">Category Stream</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3 outline-none focus:border-brand-500 dark:focus:border-brand-400 transition"
                  >
                    {['Interview Experiences', 'Referral Leads', 'Study Guides', 'Q&A'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-600 dark:text-slate-300">Description content</label>
                  <textarea
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide detailed interview patterns, questions, or guidelines here..."
                    className="w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3 outline-none focus:border-brand-500 dark:focus:border-brand-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold p-3.5 shadow-lg shadow-brand-500/25 transition-all animate-fade-in"
                >
                  Publish Community Post
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;

