import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ trendingQuizzes }) => {
  const [quizzes, setQuizzes] = useState(trendingQuizzes);

  useEffect(() => {
    const sortedQuizzes = [...quizzes].sort((a, b) => b.views - a.views); // Sort quizzes by views
    setQuizzes(sortedQuizzes);
  }, [quizzes]);

  return (
    <div className="dashboard-container">
      <div className="stats-container">
        <div className="stat-item">
          <h2 className="stat-number orange">{quizzes.length}</h2>
          <p>Quiz Created</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-number green">
            {quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)}
          </h2>
          <p>Questions Created</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-number blue">
            {quizzes.reduce((total, quiz) => total + (quiz.views || 0), 0)}
          </h2>
          <p>Total Impressions</p>
        </div>
      </div>

      <section className="trending-quizzes">
        <h3>Trending Quizzes</h3>
        <div className="quizzes-grid">
          {quizzes.length === 0 ? (
            <p>No trending quizzes available.</p>
          ) : (
            quizzes.map((quiz, index) => (
              <div className="quiz-card" key={index}>
                <h4>{quiz.title}</h4>
                <p className="quiz-stats">
                  <span className="views">{quiz.views || 0}</span>
                  <img src={quiz.icon} alt="Icon" className="quiz-icon" />
                  <span className="created-date">Created on: {quiz.createdDate}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;