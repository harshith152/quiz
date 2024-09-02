import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import AnalyticsPage from './components/AnalyticsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userCredentials, setUserCredentials] = useState(() => {
    const savedCredentials = localStorage.getItem('userCredentials');
    return savedCredentials ? JSON.parse(savedCredentials) : null;
  });

  const [quizzes, setQuizzes] = useState(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    return savedQuizzes ? JSON.parse(savedQuizzes) : [];
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleSignup = (email, password) => {
    const credentials = { email, password };
    setUserCredentials(credentials);
    localStorage.setItem('userCredentials', JSON.stringify(credentials));
    setIsAuthenticated(false); 
  };

  const handleLogin = (email, password) => {
    if (userCredentials && userCredentials.email === email && userCredentials.password === password) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const handleCreateQuiz = (newQuiz) => {
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  const getQuizDataById = (quizId) => {
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || quizzes;

    
    const quiz = savedQuizzes.find(quiz => quiz.id === quizId);
    
    if (quiz) {
      quiz.views = (quiz.views || 0) + 1;  
      localStorage.setItem('quizzes', JSON.stringify(savedQuizzes));
      return quiz;
    }
    return null;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home/dashboard" /> : <Auth onLogin={handleLogin} onSignup={handleSignup} />
          }
        />
        <Route
          path="/home/*"
          element={
            isAuthenticated ? (
              <HomePage
                onCreateQuiz={handleCreateQuiz}
                onLogout={handleLogout}
                quizzes={quizzes}
                setQuizzes={setQuizzes} 
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quiz/:quizId"
          element={<QuizPage getQuizDataById={getQuizDataById} />} 
        />
        <Route
          path="/analytics"
          element={
            isAuthenticated ? (
              <AnalyticsPage quizzes={quizzes} setQuizzes={setQuizzes} /> 
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
