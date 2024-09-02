import React, { useEffect, useState } from 'react';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    if (savedQuizzes) {
      const parsedQuizzes = JSON.parse(savedQuizzes);
      setQuizzes(parsedQuizzes);
    }
  }, []);

  return (
    <div className="analytics-container">
      <h2 className="title">Quiz Analysis</h2>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Actions</th>
            <th>Analysis</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <tr key={quiz.id}>
                <td>{index + 1}</td>
                <td>{quiz.name}</td>
                <td>{quiz.createdOn}</td>
                <td>{quiz.impressions}</td>
                <td className="actions">
                  <button className="edit-btn">✏️</button>
                  <button className="delete-btn">🗑️</button>
                  <button className="share-btn">🔗</button>
                </td>
                <td>
                  <button className="analysis-link-button">
                    Question Wise Analysis
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No quizzes available. Please create a quiz.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="more-quizzes">[more quizzes can be added]</div>
    </div>
  );
};

export default AnalyticsPage;