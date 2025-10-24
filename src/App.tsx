import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { LoginRegister } from './components/LoginRegister';
import { HomePage } from './components/HomePage';
import { LearnMorePage } from './components/LearnMorePage';
import { CoursesPage } from './components/CoursesPage';
import { ProfilePage } from './components/ProfilePage';
import { DashboardPage } from './components/DashboardPage';
import { QuestionnaireModal } from './components/QuestionnaireModal';
import { AIChatbot } from './components/AIChatbot';
import { Navbar } from './components/Navbar';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState<any>(null);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chatSubject, setChatSubject] = useState<string | undefined>(undefined);

  const handleLogin = (data: any) => {
    setUserData(data);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentPage('home');
  };

  const handleUpdateUser = (data: any) => {
    setUserData(data);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleOpenQuestionnaire = (subject: string) => {
    setSelectedSubject(subject);
    setQuestionnaireOpen(true);
  };

  const handleOpenChat = (subject: string) => {
    setChatSubject(subject);
  };

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
          onOpenChat={handleOpenChat}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage userData={userData} onUserDataUpdate={handleUpdateUser} />
      )}
      {currentPage === 'dashboard' && <DashboardPage />}

      {/* Persistent AI Chatbot */}
      <AIChatbot initialSubject={chatSubject} />

      {/* Questionnaire Modal */}
      <QuestionnaireModal
        isOpen={questionnaireOpen}
        onClose={() => setQuestionnaireOpen(false)}
        subject={selectedSubject}
      />

      <Toaster />
    </div>
  );
}
