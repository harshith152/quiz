import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onContinue }) => {
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('Q&A'); // Set default quiz type to 'Q&A'

  useEffect(() => {
    if (isOpen) {
      // Reset quiz name and type when modal is opened
      setQuizName('');
      setQuizType('Q&A');
    }
  }, [isOpen]);

  const handleQuizTypeChange = (type) => {
    setQuizType(type);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <input
            type="text"
            placeholder="Quiz name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="quiz-name-input"
          />
          <div className="quiz-type-container">
            <label className="quiz-type-label">Quiz Type</label>
            <button
              className={`quiz-type-button ${quizType === 'Q&A' ? 'active' : ''}`}
              onClick={() => handleQuizTypeChange('Q&A')}
            >
              Q & A
            </button>
            <button
              className={`quiz-type-button ${quizType === 'Poll' ? 'active' : ''}`}
              onClick={() => handleQuizTypeChange('Poll')}
            >
              Poll Type
            </button>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="modal-button cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-button continue-button"
            onClick={() => onContinue(quizName, quizType)}
            disabled={!quizName || !quizType} // Disable if no quiz name or type is selected
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
