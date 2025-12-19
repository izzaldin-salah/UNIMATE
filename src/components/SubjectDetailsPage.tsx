import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  FileText, 
  Brain, 
  MessageSquare, 
  ChevronRight, 
  Search, 
  Download, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Check,
  LayoutGrid,
  List,
  Send,
  Paperclip
} from 'lucide-react';
import { getSubjectPDFs } from '../lib/storage';
import { sendMessageToAI } from '../lib/chat';
import { PDFViewerPage } from './PDFViewerPage';

// ==============================================================================
// 1. MOCK DATA 
// ==============================================================================

const SUBJECT_DATA = {
  title: "Programming Fundamentals",
  department: "General Departments",
  year: "Year 2",
  code: "CS-101"
};

// ==============================================================================
// 2. UI COMPONENTS
// ==============================================================================

const Button = ({ children, variant = 'primary', className = '', icon: Icon, loading = false, ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants: Record<string, string> = {
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
  const [selectedLecture, setSelectedLecture] = useState<any>(null);

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

  // If a lecture is selected, show the full-screen PDF viewer
  if (selectedLecture) {
    return (
      <PDFViewerPage 
        lecture={selectedLecture}
        onBack={() => setSelectedLecture(null)}
      />
    );
  }

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
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    icon={Eye}
                    onClick={() => setSelectedLecture(lecture)}
                  >
                    View
                  </Button>
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
                   <Button 
                     variant="primary" 
                     className="h-9 px-4 text-sm whitespace-nowrap shadow-none" 
                     icon={Eye}
                     onClick={() => setSelectedLecture(lecture)}
                   >
                     View
                   </Button>
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
  const [generatedQuiz, setGeneratedQuiz] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: any}>({});
  const [gradingResults, setGradingResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 minutes in seconds

  // Timer countdown effect
  useEffect(() => {
    if (step !== 'preview' || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, isSubmitting]);

  const handleGenerate = async () => {
    setStep('loading');
    setError(null);
    setTimeRemaining(900); // Reset timer to 15 minutes

    try {
      // Get selected question types
      const selectedTypes = Object.entries(config.types)
        .filter(([_, enabled]) => enabled)
        .map(([type, _]) => {
          if (type === 'mcq') return 'Multiple Choice';
          if (type === 'trueFalse') return 'True/False';
          if (type === 'shortAnswer') return 'Short Answer';
          return type;
        });

      // Build the prompt for AI
      const prompt = `Generate a quiz with the following specifications:
- Number of questions: ${config.count}
- Difficulty level: ${config.difficulty}
- Question types: ${selectedTypes.join(', ')}
- Subject: Programming Fundamentals (based on uploaded lectures about C++ fundamentals, loops, conditions, arrays, strings, functions, and pointers)

Please generate the quiz in JSON format. Each question should have:
- "id": unique number
- "question": the question text
- "type": "mcq", "trueFalse", or "shortAnswer"
- "options": array of options (for MCQ and True/False only)
- "correct": correct answer index (for MCQ and True/False) or correct answer text (for short answer)

Return ONLY the JSON array, nothing else. Example format:
[
  {
    "id": 1,
    "question": "What is a pointer?",
    "type": "mcq",
    "options": ["A variable", "A memory address", "A function", "A loop"],
    "correct": 1
  }
]`;

      // Call AI API
      const response = await sendMessageToAI(prompt, []);

      // Try to parse the JSON response
      let quizData;
      try {
        // Extract JSON from response (in case AI adds extra text)
        const jsonMatch = response.match(/\[\s*{[\s\S]*}\s*\]/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[0]);
        } else {
          quizData = JSON.parse(response);
        }
      } catch (parseError) {
        console.error('Failed to parse quiz JSON:', parseError);
        throw new Error('AI generated invalid quiz format. Please try again.');
      }

      setGeneratedQuiz(quizData);
      setStep('preview');
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setError(err.message || 'Failed to generate quiz. Please try again.');
      setStep('config');
    }
  };

  const toggleType = (type: 'mcq' | 'trueFalse' | 'shortAnswer') => {
    setConfig(prev => ({
      ...prev,
      types: { ...prev.types, [type]: !prev.types[type] }
    }));
  };

  const handleAnswerChange = (questionIdx: number, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIdx]: answer
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Build the grading request
      const gradingPrompt = `Please grade this quiz submission. Here are the questions and student answers:

${generatedQuiz.map((q, idx) => {
  const userAnswer = userAnswers[idx];
  let answerText = '';
  
  if (q.type === 'mcq' || q.type === 'trueFalse') {
    answerText = userAnswer !== undefined ? q.options[userAnswer] : 'Not answered';
  } else {
    answerText = userAnswer || 'Not answered';
  }
  
  return `Question ${idx + 1}: ${q.question}
Correct Answer: ${q.type === 'shortAnswer' ? q.correct : q.options[q.correct]}
Student Answer: ${answerText}`;
}).join('\n\n')}

Please provide grading results in JSON format:
{
  "totalQuestions": ${generatedQuiz.length},
  "correctAnswers": <number of correct answers>,
  "score": <percentage score>,
  "grade": "<letter grade A-F>",
  "feedback": "<overall feedback>",
  "questionResults": [
    {
      "questionNumber": 1,
      "correct": true/false,
      "feedback": "<specific feedback for this question>"
    }
  ]
}

Return ONLY the JSON, nothing else.`;

      const response = await sendMessageToAI(gradingPrompt, []);

      // Parse the grading results
      let results;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        } else {
          results = JSON.parse(response);
        }
      } catch (parseError) {
        console.error('Failed to parse grading results:', parseError);
        throw new Error('Failed to process grading results. Please try again.');
      }

      setGradingResults(results);
      setStep('results');
    } catch (err: any) {
      console.error('Grading error:', err);
      setError(err.message || 'Failed to grade quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    const timeWarning = timeRemaining <= 60; // Show warning when 1 minute or less
    const timeCritical = timeRemaining <= 30; // Show critical when 30 seconds or less

    return (
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
        {/* Timer Banner */}
        <div className={`mb-4 p-4 rounded-lg border-2 flex items-center justify-between transition-all ${
          timeCritical ? 'bg-red-50 border-red-500 animate-pulse' :
          timeWarning ? 'bg-orange-50 border-orange-500' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 ${
              timeCritical ? 'text-red-600' :
              timeWarning ? 'text-orange-600' :
              'text-blue-600'
            }`} />
            <div>
              <p className="text-sm font-semibold text-slate-800">Time Remaining</p>
              <p className="text-xs text-slate-600">Quiz will auto-submit when time expires</p>
            </div>
          </div>
          <div className={`text-3xl font-bold ${
            timeCritical ? 'text-red-600' :
            timeWarning ? 'text-orange-600' :
            'text-blue-600'
          }`}>
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Generated Quiz ({generatedQuiz.length} Questions)
          </h2>
          <Button variant="secondary" onClick={() => setStep('config')}>New Quiz</Button>
        </div>

        <div className="space-y-6 mb-8">
          {generatedQuiz.map((q, idx) => (
            <Card key={q.id || idx} className="p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-lg text-sm">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-lg font-medium text-slate-800 mb-1">{q.question}</p>
                  {q.type && (
                    <span className="inline-block text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'trueFalse' ? 'True/False' : 'Short Answer'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Multiple Choice or True/False Options */}
              {q.options && Array.isArray(q.options) && (
                <div className="space-y-3 pl-12">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = userAnswers[idx] === optIdx;
                    return (
                      <label 
                        key={optIdx} 
                        onClick={() => handleAnswerChange(idx, optIdx)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all group ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-slate-300 group-hover:border-blue-500'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <span className={isSelected ? 'text-blue-900 font-medium' : 'text-slate-700'}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Short Answer Input */}
              {q.type === 'shortAnswer' && (
                <div className="pl-12">
                  <textarea
                    value={userAnswers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                    rows={3}
                  />
                </div>
              )}
            </Card>
          ))}
          
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Button 
              variant="primary" 
              className="w-48" 
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || Object.keys(userAnswers).length === 0}
            >
              {isSubmitting ? 'Grading...' : 'Submit Quiz'}
            </Button>
            <p className="text-xs text-slate-400 mt-3">
              {Object.keys(userAnswers).length} of {generatedQuiz.length} questions answered
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && gradingResults) {
    return (
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
        {/* Results Header */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-bold mb-4 shadow-lg">
              {Math.round(gradingResults.score)}%
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
            <p className="text-lg text-slate-600 mb-4">Grade: <span className="font-bold text-blue-600">{gradingResults.grade}</span></p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">{gradingResults.correctAnswers} Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 text-red-600" />
                <span className="text-slate-700">{gradingResults.totalQuestions - gradingResults.correctAnswers} Incorrect</span>
              </div>
            </div>
            {gradingResults.feedback && (
              <p className="mt-4 text-slate-600 italic border-t border-blue-200 pt-4">"{gradingResults.feedback}"</p>
            )}
          </div>
        </Card>

        {/* Question-by-Question Results */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Detailed Results</h3>
          <Button variant="secondary" onClick={() => { setStep('config'); setUserAnswers({}); setGradingResults(null); }}>Take Another Quiz</Button>
        </div>

        <div className="space-y-4 mb-8">
          {gradingResults.questionResults?.map((result: any, idx: number) => {
            const question = generatedQuiz[idx];
            const userAnswer = userAnswers[idx];
            const isCorrect = result.correct;

            return (
              <Card key={idx} className={`p-6 border-l-4 ${
                isCorrect ? 'border-green-500 bg-green-50/30' : 'border-red-500 bg-red-50/30'
              }`}>
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 mb-2">Question {idx + 1}: {question.question}</p>
                    
                    {question.type === 'shortAnswer' ? (
                      <>
                        <p className="text-sm text-slate-600 mb-1">Your Answer: <span className="font-medium">{userAnswer || 'Not answered'}</span></p>
                        <p className="text-sm text-slate-600">Correct Answer: <span className="font-medium text-green-700">{question.correct}</span></p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600 mb-1">Your Answer: <span className="font-medium">{userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}</span></p>
                        <p className="text-sm text-slate-600">Correct Answer: <span className="font-medium text-green-700">{question.options[question.correct]}</span></p>
                      </>
                    )}
                    
                    {result.feedback && (
                      <p className="text-sm text-slate-500 italic mt-2 pl-3 border-l-2 border-slate-300">{result.feedback}</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 mb-1">Failed to Generate Quiz</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <Circle className="w-4 h-4" />
          </button>
        </div>
      )}

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
                    onClick={() => toggleType(type.id as 'mcq' | 'trueFalse' | 'shortAnswer')}
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

const ChatView = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Convert messages to chat history format
      const conversationHistory = messages.map(msg => ({
        role: (msg.role === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: msg.content
      }));

      // Call real AI via n8n webhook
      const aiResponse = await sendMessageToAI(newMsg.content, conversationHistory);
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'ai',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    "Summarize Lecture 3",
    "Generate a practice question",
    "Explain 'Polymorphism'"
  ];

  return (
    <div className="h-[700px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">UniMate Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-500 font-medium">Online & Ready</span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="text-slate-400 hover:text-red-500" 
          icon={Circle}
          onClick={() => {
            if (confirm('Are you sure you want to clear the chat history?')) {
              setMessages([]);
            }
          }}
        >
          Clear Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        
        {/* Welcome Info */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-50 text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
            This conversation is grounded in your uploaded lectures.
          </div>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.role === 'user' 
                  ? 'bg-slate-200 text-slate-600' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? 'ME' : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-1">
                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className={`text-[10px] text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="flex max-w-[80%] gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        
        {/* Suggested Prompts */}
        {messages.length < 4 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
            {suggestedPrompts.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => setInput(prompt)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          
          <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-200 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Ask about your lectures..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 placeholder-slate-400 resize-none py-2.5 max-h-32 focus:outline-none"
            rows={1}
            style={{ minHeight: '44px' }}
          />

          <button 
            type="submit" 
            disabled={!input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-400">UniMate AI can make mistakes. Please verify important information from the lecture notes.</p>
        </div>
      </div>
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
    { id: 'chat', label: 'AI Chat', icon: MessageSquare }
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
          <button onClick={() => onNavigate('courses')} className="hover:text-blue-600 cursor-pointer transition-colors">{SUBJECT_DATA.department}</button>
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group flex items-center gap-2 pb-4 border-b-2 transition-all duration-200 font-medium text-sm
                    ${isActive 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'lectures' && <LecturesView subjectName={subjectName} />}
          {activeTab === 'quiz' && <QuizView />}
          {activeTab === 'chat' && <ChatView />}
        </div>

      </main>
    </div>
  );
}
