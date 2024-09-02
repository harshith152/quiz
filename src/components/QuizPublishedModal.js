import React from 'react';
import './QuizPublishedModal.css';

const QuizPublishedModal = ({ isOpen, onClose, quizLink }) => {
  if (!isOpen) return null;

  const handleCopyToClipboard = () => { 
    navigator.clipboard.writeText(quizLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content quiz-published-modal">
        <button className="close-modal" onClick={onClose}>×</button>
        <h2>Congrats, your Quiz is Published!</h2>
        <input
          type="text"
          value="Your link is here"
          readOnly
          className="quiz-link-input"
        />
        <button className="modal-button share-button" onClick={handleCopyToClipboard}>
          Share
        </button>
      </div>
    </div>
  );
};

export default QuizPublishedModal;
