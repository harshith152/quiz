import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import AnalyticsPage from './AnalyticsPage';
import Modal from './Modal';
import QAQuestionModal from './QAQuestionModal';
import './HomePage.css';

const HomePage = ({ onCreateQuiz, onLogout }) => {
  const [isFirstModalOpen, setFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const [quizType, setQuizType] = useState('Q&A');
  const [quizzes, setQuizzes] = useState(() => {
    
    const savedQuizzes = localStorage.getItem('quizzes');
    return savedQuizzes ? JSON.parse(savedQuizzes) : [];
  });

  const handleOpenFirstModal = () => {
    setFirstModalOpen(true);
  };

  const handleCloseFirstModal = () => {
    setFirstModalOpen(false);
  };

  const handleContinueFirstModal = (quizName, selectedQuizType) => {
    setQuizType(selectedQuizType); 
    setFirstModalOpen(false);
    setSecondModalOpen(true);
  };

  const handleCloseSecondModal = () => {
    setSecondModalOpen(false);
  };

  const handleCreateQuiz = (newQuiz) => {
    setSecondModalOpen(false);

    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  useEffect(() => {
    const sortedQuizzes = [...quizzes].sort((a, b) => b.views - a.views); 
    setQuizzes(sortedQuizzes);
  }, [quizzes]);

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="logo">QUIZZIE</div>
        <nav className="nav-menu">
          <ul>
            <li className="nav-item">
              <Link to="/home/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/home/analytics">Analytics</Link>
            </li>
            <li className="nav-item">
              <button className="create-quiz-button" onClick={handleOpenFirstModal}>
                Create Quiz
              </button>
            </li>
          </ul>
        </nav>
        <div className="logout" onClick={onLogout}>LOGOUT</div> {/* Handle Logout */}
      </aside>

      <main className={`main-content ${isFirstModalOpen || isSecondModalOpen ? 'blur' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard trendingQuizzes={quizzes} />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>

      <Modal
        isOpen={isFirstModalOpen}
        onClose={handleCloseFirstModal}
        onContinue={handleContinueFirstModal}
      />

      <QAQuestionModal
        isOpen={isSecondModalOpen}
        onClose={handleCloseSecondModal}
        onCreateQuiz={handleCreateQuiz}
        quizType={quizType} 
      />
    </div>
  );
};

export default HomePage;
