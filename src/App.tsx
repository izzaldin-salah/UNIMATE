import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { LoginRegister } from './components/LoginRegister';
import { HomePage } from './components/HomePage';
import { LearnMorePage } from './components/LearnMorePage';
import { CoursesPage } from './components/CoursesPage';
import { ProfilePage } from './components/ProfilePage';
import { DashboardPage } from './components/DashboardPage';
import { SubjectDetailsPage } from './components/SubjectDetailsPage';
import { QuestionnaireModal } from './components/QuestionnaireModal';
import { Navbar } from './components/Navbar';

const STORAGE_KEY = 'unimate_user_session';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState<any>(null);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const parsedData = JSON.parse(savedSession);
        // Verify session is not expired (optional - 7 days expiry)
        const savedTime = parsedData.timestamp;
        const currentTime = Date.now();
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        
        if (currentTime - savedTime < sevenDaysInMs) {
          setUserData(parsedData.user);
          setIsLoggedIn(true);
        } else {
          // Session expired, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (data: any) => {
    setUserData(data);
    setIsLoggedIn(true);
    setCurrentPage('home');
    
    // Save session to localStorage
    const sessionData = {
      user: data,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentPage('home');
    
    // Clear session from localStorage
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleUpdateUser = (data: any) => {
    setUserData(data);
    
    // Update session in localStorage
    const sessionData = {
      user: data,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleOpenQuestionnaire = (subject: string) => {
    setSelectedSubject(subject);
    setQuestionnaireOpen(true);
  };

  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubjectName(subjectName);
    setCurrentPage('subject-details');
  };

  // Show loading state while checking for saved session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginRegister onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userData={userData}
      />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'learn-more' && <LearnMorePage onNavigate={handleNavigate} />}
      {currentPage === 'courses' && (
        <CoursesPage
          onOpenQuestionnaire={handleOpenQuestionnaire}
          onSubjectClick={handleSubjectClick}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage userData={userData} onUserDataUpdate={handleUpdateUser} />
      )}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'subject-details' && (
        <SubjectDetailsPage 
          onNavigate={handleNavigate}
          subjectName={selectedSubjectName}
        />
      )}

      <QuestionnaireModal
        isOpen={questionnaireOpen}
        onClose={() => setQuestionnaireOpen(false)}
        subject={selectedSubject}
      />
      <Toaster />
    </div>
  );
}
