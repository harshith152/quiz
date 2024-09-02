import React, { useState } from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import AnalyticsPage from './AnalyticsPage';
import './HomePage.css';
import Modal from './Modal';
import QAQuestionModal from './QAQuestionModal';

const HomePage = () => {
  const [isFirstModalOpen, setFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const [quizType, setQuizType] = useState('Q&A');

  const handleOpenFirstModal = () => {
    setFirstModalOpen(true);
  };

  const handleCloseFirstModal = () => {
    setFirstModalOpen(false);
  };

  const handleContinueFirstModal = (quizName, selectedQuizType) => {
    setQuizType(selectedQuizType); // Set the quiz type based on selection
    setFirstModalOpen(false);
    setSecondModalOpen(true);
  };

  const handleCloseSecondModal = () => {
    setSecondModalOpen(false);
  };

  const handleCreateQuiz = (quizDetails) => {
    setSecondModalOpen(false);
    console.log('Quiz Created:', quizDetails);
    // Handle quiz creation logic here
  };

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
        <div className="logout">LOGOUT</div>
      </aside>

      <main className={`main-content ${isFirstModalOpen || isSecondModalOpen ? 'blur' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
        quizType={quizType} // Pass the quiz type to QAQuestionModal
      />
    </div>
  );
};

export default HomePage;
