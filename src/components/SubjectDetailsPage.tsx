import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Brain, 
  MessageSquare, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  MoreVertical,
  Check,
  LayoutGrid,
  List
} from 'lucide-react';
import { getSubjectPDFs } from '../lib/storage';

// ==============================================================================
// 1. MOCK DATA 
// ==============================================================================

const SUBJECT_DATA = {
  title: "Programming Fundamentals",
  department: "General Departments",
  year: "Year 2",
  code: "CS-101"
};

const LECTURES_DATA = [
  { id: 1, title: "Lecture 1: Introduction to C++", size: "1.2 MB", pages: 12, date: "Oct 10, 2024" },
  { id: 2, title: "Lecture 2: Variables & Data Types", size: "2.4 MB", pages: 18, date: "Oct 17, 2024" },
  { id: 3, title: "Lecture 3: Loops & Conditions", size: "3.1 MB", pages: 24, date: "Oct 24, 2024" },
  { id: 4, title: "Lecture 4: Arrays & Strings", size: "2.8 MB", pages: 20, date: "Oct 31, 2024" },
  { id: 5, title: "Lecture 5: Functions & Scope", size: "1.9 MB", pages: 15, date: "Nov 07, 2024" },
  { id: 6, title: "Lecture 6: Pointers Basics", size: "4.5 MB", pages: 32, date: "Nov 14, 2024" },
];

const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which loop is guaranteed to execute at least once?",
    options: ["For Loop", "While Loop", "Do-While Loop", "Foreach Loop"],
    correct: 2
  },
  {
    id: 2,
    question: "What is the correct syntax to output 'Hello World' in C++?",
    options: ["print('Hello World');", "cout << 'Hello World';", "Console.WriteLine('Hello World');", "System.out.println('Hello World');"],
    correct: 1
  }
];

// ==============================================================================
// 2. UI COMPONENTS
// ==============================================================================

const Button = ({ children, variant = 'primary', className = '', icon: Icon, loading = false, ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-95 border border-transparent",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm active:scale-95",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  const sizes = "px-4 py-2.5 rounded-lg text-sm";

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes} ${className}`} {...props}>
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && (
        <Icon className="w-4 h-4 mr-2" strokeWidth={2} />
      )}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hoverEffect = false }: any) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-sm ${hoverEffect ? 'hover:shadow-md hover:border-blue-100 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

// ==============================================================================
// 3. SUB-VIEWS (TABS)
// ==============================================================================

const LecturesView = ({ subjectName }: { subjectName: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('name');
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load PDFs from Supabase Storage
  useEffect(() => {
    loadLectures();
  }, [subjectName]);

  const loadLectures = async () => {
    setLoading(true);
    const files = await getSubjectPDFs(subjectName);
    setLectures(files);
    setLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredLectures = lectures
    .filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date-newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'size-largest':
          return b.size - a.size;
        case 'size-smallest':
          return a.size - b.size;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search lectures..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto items-center">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="date-newest">Sort: Newest First</option>
            <option value="date-oldest">Sort: Oldest First</option>
            <option value="size-largest">Sort: Largest First</option>
            <option value="size-smallest">Sort: Smallest First</option>
          </select>
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && lectures.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No lectures available yet</h3>
          <p className="text-slate-500">Lecture materials will appear here once uploaded by your instructor</p>
        </Card>
      )}

      {/* Grid / List Container */}
      {!loading && lectures.length > 0 && (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {filteredLectures.map((lecture) => (
          <Card key={lecture.name} hoverEffect className={`group ${viewMode === 'grid' ? 'p-5 flex flex-col h-full' : 'p-4 flex items-center gap-4'}`}>
            
            {/* Grid View Content */}
            {viewMode === 'grid' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2 min-h-[3rem]">
                  {lecture.name.replace(/\d+-\w+\.pdf$/, '').replace(/_/g, ' ')}
                </h3>
                
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <a href={lecture.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="primary" className="w-full" icon={Eye}>View</Button>
                  </a>
                  <a href={lecture.url} download className="block">
                    <Button variant="secondary" className="w-full" icon={Download}>Save</Button>
                  </a>
                </div>
              </>
            )}

            {/* List View Content */}
            {viewMode === 'list' && (
              <>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate text-sm sm:text-base">
                    {lecture.name.replace(/\d+-\w+\.pdf$/, '').replace(/_/g, ' ')}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>{formatFileSize(lecture.size)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="hidden sm:inline">{formatDate(lecture.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <a href={lecture.url} target="_blank" rel="noopener noreferrer">
                     <Button variant="primary" className="h-9 px-4 text-sm whitespace-nowrap shadow-none" icon={Eye}>
                       View
                     </Button>
                   </a>
                   <a href={lecture.url} download className="hidden sm:block">
                     <Button variant="secondary" className="h-9 px-4 text-sm whitespace-nowrap shadow-none" icon={Download}>
                       Download
                     </Button>
                   </a>
                </div>
              </>
            )}
          </Card>
        ))}
        </div>
      )}

      {!loading && filteredLectures.length === 0 && lectures.length > 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-4">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-slate-500 font-medium">No lectures found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

const QuizView = () => {
  const [step, setStep] = useState('config');
  const [config, setConfig] = useState({
    count: 10,
    difficulty: 'Medium',
    types: { mcq: true, trueFalse: false, shortAnswer: false }
  });

  const handleGenerate = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('preview');
    }, 2500);
  };

  const toggleType = (type: string) => {
    setConfig(prev => ({
      ...prev,
      types: { ...prev.types, [type]: !prev.types[type] }
    }));
  };

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-2xl shadow-lg border border-blue-100">
            <Sparkles className="w-12 h-12 text-blue-600 animate-spin-slow" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Generating Quiz...</h3>
        <p className="text-slate-500 max-w-sm text-center">
          Analyzing lecture content and creating questions based on your preferences.
        </p>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Generated Quiz
          </h2>
          <Button variant="secondary" onClick={() => setStep('config')}>New Quiz</Button>
        </div>

        <div className="space-y-6 mb-8">
          {MOCK_QUIZ_QUESTIONS.map((q, idx) => (
            <Card key={q.id} className="p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-lg text-sm">
                  {idx + 1}
                </span>
                <p className="text-lg font-medium text-slate-800 pt-0.5">{q.question}</p>
              </div>
              <div className="space-y-3 pl-12">
                {q.options.map((opt, optIdx) => (
                  <label key={optIdx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all group">
                    <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
          
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 mb-4">... 8 more questions generated</p>
            <Button variant="primary" className="w-48" disabled>Submit Quiz (Preview)</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-3 border border-blue-400/30">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>AI Powered</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Smart Quiz Generator</h2>
            <p className="text-blue-100 max-w-lg">
              Create a personalized quiz based on your course lectures. Test your knowledge and identify gaps instantly.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hidden md:block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-medium">Model Ready</span>
            </div>
            <div className="text-xs text-blue-200">UniMate AI v2.4</div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <Card className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left Col: Settings */}
          <div className="space-y-8">
            
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Question Types</label>
              <div className="space-y-3">
                {[
                  { id: 'mcq', label: 'Multiple Choice', desc: 'Standard 4-option questions' },
                  { id: 'trueFalse', label: 'True / False', desc: 'Quick concept checks' },
                  { id: 'shortAnswer', label: 'Short Answer', desc: 'Type-in responses' }
                ].map(type => (
                  <div 
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      config.types[type.id as keyof typeof config.types]
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      config.types[type.id as keyof typeof config.types] ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                    }`}>
                      {config.types[type.id as keyof typeof config.types] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${config.types[type.id as keyof typeof config.types] ? 'text-blue-900' : 'text-slate-700'}`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-slate-500">{type.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Summary & Action */}
          <div className="flex flex-col h-full bg-slate-50 rounded-xl p-6 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Summary</h3>
            
            <div className="space-y-4 mb-auto">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Source Material</span>
                <span className="font-medium text-slate-800">All Lectures (6)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Est. Duration</span>
                <span className="font-medium text-slate-800">~{config.count * 1.5} mins</span>
              </div>
              <div className="h-px bg-slate-200 my-2"></div>
              <div className="flex justify-between items-start text-sm">
                <span className="text-slate-500">Selected Types</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                  {Object.entries(config.types).filter(([_, v]) => v).map(([k, _]) => (
                     <span key={k} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 capitalize">
                       {k.replace(/([A-Z])/g, ' $1').trim()}
                     </span>
                  ))}
                  {Object.values(config.types).every(v => !v) && <span className="text-red-500 text-xs">Select at least one</span>}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                variant="primary" 
                className="w-full h-12 text-lg shadow-lg hover:shadow-blue-500/25"
                icon={Sparkles}
                onClick={handleGenerate}
                disabled={Object.values(config.types).every(v => !v)}
              >
                Generate Quiz
              </Button>
              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Takes approx. 5-10 seconds
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ==============================================================================
// 4. MAIN PAGE
// ==============================================================================

interface SubjectDetailsPageProps {
  onNavigate: (page: string) => void;
  subjectName?: string;
}

export function SubjectDetailsPage({ onNavigate, subjectName = "Programming Fundamentals" }: SubjectDetailsPageProps) {
  const [activeTab, setActiveTab] = useState('lectures');

  const tabs = [
    { id: 'lectures', label: 'Lectures', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, disabled: true }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-500 mb-6 gap-2">
          <button onClick={() => onNavigate('courses')} className="hover:text-blue-600 cursor-pointer transition-colors">
            Courses
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-blue-600 cursor-pointer transition-colors">{SUBJECT_DATA.department}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{subjectName}</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
              {subjectName}
            </h1>
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium border border-slate-200">
                {SUBJECT_DATA.code}
              </span>
              <span>{SUBJECT_DATA.department}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{SUBJECT_DATA.year}</span>
            </div>
          </div>
          <Button variant="outline" className="hidden md:flex" icon={AlertCircle}>
            Report Issue
          </Button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`
                    group flex items-center gap-2 pb-4 border-b-2 transition-all duration-200 font-medium text-sm
                    ${isActive 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}
                    ${tab.disabled ? 'opacity-50 cursor-not-allowed hover:text-slate-500 hover:border-transparent' : ''}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {tab.label}
                  {tab.disabled && (
                    <span className="ml-1 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full border border-slate-200">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'lectures' && <LecturesView subjectName={subjectName} />}
          {activeTab === 'quiz' && <QuizView />}
        </div>

      </main>
    </div>
  );
}
