import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizPage.css';
import trophyImage from '../Assets/images/Trophy.png';

const QuizPage = ({ getQuizDataById }) => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [score, setScore] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  useEffect(() => {
    const quizData = getQuizDataById(quizId);
    if (quizData) {
      setQuiz(quizData);
    } else {
      alert('Quiz not found');
      navigate('/');
    }
  }, [quizId, getQuizDataById, navigate]);

  const handleNextQuestion = useCallback(() => {
    setIsNextDisabled(true);

    if (selectedOption !== null && quiz?.globalOptionType === 'Q&A' && quiz.questions[currentQuestionIndex].correctOption === selectedOption) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
    } else {
      setShowCompletionMessage(true);
    }

    setIsNextDisabled(false);
  }, [currentQuestionIndex, selectedOption, quiz]);

  useEffect(() => {
    if (quiz && quiz.questions?.[currentQuestionIndex]?.timer !== 'OFF') {
      setTimeLeft(parseInt(quiz.questions[currentQuestionIndex].timer, 10));

      const timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleNextQuestion();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    } else {
      setTimeLeft(null);
    }
  }, [quiz, currentQuestionIndex, handleNextQuestion]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  if (showCompletionMessage) {
    return (
      <div className="quiz-page-outer">
        <div className="quiz-completion-container">
          {quiz.globalOptionType === 'Q&A' ? (
            <>
              <h2>Congrats, Quiz is completed</h2>
              <img src={trophyImage} alt="Trophy" className="trophy-image" />
              <p>Your Score is <span className="quiz-score">{score}/{quiz.questions.length}</span></p>
              <button onClick={() => navigate('/home/dashboard')}>Go to Dashboard</button>
            </>
          ) : (
            <h2>Thank you for participating in the Poll</h2>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="quiz-page-outer">
      <div className="quiz-page">
        <div className="quiz-header">
          <div className="question-count">
            {currentQuestionIndex + 1}/{quiz.questions.length}
          </div>
          {timeLeft !== null && (
            <div className="timer">
              {timeLeft < 10 ? `00:0${timeLeft}s` : `00:${timeLeft}s`}
            </div>
          )}
        </div>
        <div className="question-text">
          {currentQuestion.questionText}
        </div>
        <div className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(index)}
            >
              {option.imageUrl ? (
                <img src={option.imageUrl} alt={`Option ${index + 1}`} className="option-image" />
              ) : (
                option.text
              )}
            </button>
          ))}
        </div>
        <button
          className="next-button"
          onClick={handleNextQuestion}
          disabled={isNextDisabled}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
