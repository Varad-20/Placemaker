import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  FolderGit, Zap, Award, Layers, Server, Database, Code2,
  ExternalLink, CheckSquare, Sparkles, ChevronRight, Play
} from 'lucide-react';

const mockProjects = [
  {
    id: 1,
    title: 'AI Resume ATS Screening Platform',
    category: 'MERN + AI',
    difficulty: 'Advanced',
    summary: 'A high-performance SaaS parsing engine evaluating resumes using automated NLP keyword algorithms.',
    blueprint: [
      { step: 1, title: 'Upload Pipeline', desc: 'React drop-zone uploads PDF files to AWS S3 buckets.' },
      { step: 2, title: 'Parsing Worker', desc: 'Node server calls python worker script or OCR API to extract texts.' },
      { step: 3, title: 'ATS Engine', desc: 'Compares text array tokens with target database schemas keywords.' },
      { step: 4, title: 'Feedback Generator', desc: 'Compiles JSON suggestions and updates client state.' }
    ],
    schema: [
      { name: 'User', fields: 'id (PK), email (string), passwordHash (string), cgpa (float)' },
      { name: 'Resume', fields: 'id (PK), userId (FK), fileName (string), rawText (text), s3Url (string)' },
      { name: 'ATSScore', fields: 'id (PK), resumeId (FK), overallScore (integer), missingKeywords (array)' }
    ],
    api: [
      { path: 'POST /api/auth/register', body: '{ email, password, name }', desc: 'Registers new student users' },
      { path: 'POST /api/resumes/upload', body: 'FormData (file: PDF)', desc: 'Saves file and invokes extraction workers' },
      { path: 'GET /api/resumes/:id/analysis', body: 'None', desc: 'Retrieves parsed ATS score calculations' }
    ]
  },
  {
    id: 2,
    title: 'Real-time Collaborative Whiteboard',
    category: 'React + Socket.io',
    difficulty: 'Intermediate',
    summary: 'A canvas system drawing vectors simultaneously with peer cursor updates and persistent workspaces.',
    blueprint: [
      { step: 1, title: 'Canvas Component', desc: 'HTML5 Canvas API tracks coordinate vector paths.' },
      { step: 2, title: 'Socket Bridge', desc: 'Websocket connection sends drawing coordinates instantly.' },
      { step: 3, title: 'State Diffing', desc: 'Other users draw layers locally based on coordinates.' },
      { step: 4, title: 'Persistence DB', desc: 'Canvas states saved to Redis/MongoDB periodically.' }
    ],
    schema: [
      { name: 'User', fields: 'id (PK), name (string), socketId (string)' },
      { name: 'Board', fields: 'id (PK), title (string), createdBy (FK), drawData (array of vectors)' }
    ],
    api: [
      { path: 'POST /api/boards', body: '{ title }', desc: 'Creates new drawing workspace' },
      { path: 'GET /api/boards/:id', body: 'None', desc: 'Fetches historical vector paths to redraw canvas' }
    ]
  },
  {
    id: 3,
    title: 'E-Commerce Microservices Engine',
    category: 'Django + Redis',
    difficulty: 'Advanced',
    summary: 'Distributed purchase flow using message queues, caching models, and database sharding configurations.',
    blueprint: [
      { step: 1, title: 'Order Placement', desc: 'React submits cart order request to API gateway.' },
      { step: 2, title: 'Message Queueing', desc: 'Gateway pushes message into Celery/RabbitMQ queue.' },
      { step: 3, title: 'Inventory Check', desc: 'Worker processes order, validates stock database schemas.' },
      { step: 4, title: 'Caching layer', desc: 'Available stock counts verified in Redis buffer.' }
    ],
    schema: [
      { name: 'Product', fields: 'id (PK), name (string), price (integer), stock (integer)' },
      { name: 'Order', fields: 'id (PK), totalAmount (float), status (string), orderLines (array)' }
    ],
    api: [
      { path: 'GET /api/products', body: 'None', desc: 'Fetches cached catalog details' },
      { path: 'POST /api/orders', body: '{ cartItems, address }', desc: 'Enqueues async purchase orders' }
    ]
  }
];

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);
  const [activeTab, setActiveTab] = useState('blueprint'); // blueprint, schema, api
  const [techFilter, setTechFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const filteredProjects = mockProjects.filter(p => {
    const techMatch = techFilter === 'All' || p.category.includes(techFilter);
    const diffMatch = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    return techMatch && diffMatch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <FolderGit className="h-6 w-6 text-brand-500" /> Project Recommendation Engine
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Obtain full database schemas, API specs, and technical system blueprints to build outstanding resumes.
            </p>
          </div>
        </div>

        {/* Dynamic Filters panel */}
        <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Filter tech stack</label>
            <div className="flex flex-wrap gap-2">
              {['All', 'MERN', 'AI', 'Socket.io', 'Django'].map(tech => (
                <button
                  key={tech}
                  onClick={() => setTechFilter(tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition
                    ${techFilter === tech
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white hover:border-slate-200'}`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Difficulty band</label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Intermediate', 'Advanced'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition
                    ${difficultyFilter === diff
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white hover:border-slate-200'}`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRIMARY SPLITS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects lists */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Recommended Ideas</h3>
            {filteredProjects.map((p) => {
              const isSel = selectedProject.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`cursor-pointer p-4 rounded-xl border transition flex flex-col gap-2
                    ${isSel
                      ? 'border-brand-500 bg-brand-50/40 shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 hover:border-brand-300 hover:bg-white'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 uppercase">{p.category}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                      p.difficulty === 'Advanced' ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'
                    }`}>{p.difficulty}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 leading-normal">{p.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed truncate">{p.summary}</p>
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No custom project templates matching the selected filters.
              </div>
            )}
          </div>

          {/* Details Panels */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-800">{selectedProject.title}</h3>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{selectedProject.summary}</p>
                </div>
              </div>

              {/* Sub tabs selectors */}
              <div className="flex gap-2 border-b border-slate-100 pb-3 text-xs">
                {[
                  { id: 'blueprint', label: 'Architecture Blueprint', icon: Layers },
                  { id: 'schema', label: 'Database Schema', icon: Database },
                  { id: 'api', label: 'REST API Specs', icon: Server }
                ].map(tab => {
                  const TabIcon = tab.icon;
                  const isAct = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 pb-2 border-b-2 font-bold transition
                        ${isAct
                          ? 'border-brand-500 text-brand-700'
                          : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      <TabIcon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE TAB OUTPUT PANEL */}
              <div className="space-y-4">
                {activeTab === 'blueprint' && (
                  <div className="relative border-l-2 border-slate-100 pl-6 space-y-4 text-xs font-semibold text-slate-600">
                    {selectedProject.blueprint.map((stepObj) => (
                      <div key={stepObj.step} className="relative">
                        <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow shadow-brand-500/20">
                          {stepObj.step}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-slate-800">{stepObj.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{stepObj.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'schema' && (
                  <div className="space-y-3.5 text-xs">
                    {selectedProject.schema.map((db, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-brand-700 font-extrabold">
                          <Database className="h-4 w-4" />
                          <span>Collection/Table: {db.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Fields: <span className="text-slate-700 font-bold">{db.fields}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'api' && (
                  <div className="space-y-3 text-xs">
                    {selectedProject.api.map((route, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="font-black text-slate-800 flex items-center gap-1">
                          <Server className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                          <span className="truncate">{route.path}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Body: <span className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">{route.body}</span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium">{route.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
