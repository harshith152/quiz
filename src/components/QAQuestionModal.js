import React, { useState, useEffect } from 'react';
import QuizPublishedModal from './QuizPublishedModal';
import './QAQuestionModal.css';

const QAQuestionModal = ({ isOpen, onClose, onCreateQuiz, quizType }) => {
  const initialQuestionState = [
    { questionText: '', optionType: 'Text', options: [{ text: '', imageUrl: '' }], correctOption: null, timer: 'OFF' }
  ];

  const [questions, setQuestions] = useState(initialQuestionState);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [globalOptionType, setGlobalOptionType] = useState('Text');
  const [isQuizPublishedModalOpen, setQuizPublishedModalOpen] = useState(false);
  const [quizLink, setQuizLink] = useState('');
  const [quizName, setQuizName] = useState(''); 

  useEffect(() => {
    const savedQuizData = localStorage.getItem('currentQuizData');
    if (savedQuizData) {
      const { questions, currentQuestionIndex, globalOptionType } = JSON.parse(savedQuizData);
      setQuestions(questions);
      setCurrentQuestionIndex(currentQuestionIndex);
      setGlobalOptionType(globalOptionType);
    }
  }, []);

  useEffect(() => {
    const quizData = {
      questions,
      currentQuestionIndex,
      globalOptionType,
    };
    localStorage.setItem('currentQuizData', JSON.stringify(quizData));
  }, [questions, currentQuestionIndex, globalOptionType]);

  const resetForm = () => {
    setQuestions(initialQuestionState);
    setCurrentQuestionIndex(0);
    setGlobalOptionType('Text');
    setQuizName(''); 
  };

  const handleAddOption = () => {
    if (questions[currentQuestionIndex].options.length < 4) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].options.push({ text: '', imageUrl: '' });
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options = updatedQuestions[currentQuestionIndex].options.filter(
      (_, i) => i !== index
    );
    setQuestions(updatedQuestions);
  };

  const handleQuestionTextChange = (value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionTypeChange = (value) => {
    resetForm(); 
    setGlobalOptionType(value);
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        { questionText: '', optionType: globalOptionType, options: [{ text: '', imageUrl: '' }] }
      ]);
      setCurrentQuestionIndex(questions.length);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleCreateQuiz = () => {
    const quizId = `quiz-${Date.now()}`;
    const newQuiz = {
      id: quizId,
      title: quizName, 
      views: 0, 
      createdDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }), 
      questions,
      globalOptionType,
    };

    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    localStorage.setItem('quizzes', JSON.stringify([...existingQuizzes, newQuiz]));
    
    const generatedLink = `${window.location.origin}/quiz/${quizId}`;
    setQuizLink(generatedLink);
    setQuizPublishedModalOpen(true);
    
    onCreateQuiz(newQuiz);
    resetForm();
  };

  const handleCloseQuizPublishedModal = () => {
    setQuizPublishedModalOpen(false);
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const getPlaceholder = (key) => {
    switch (questions[currentQuestionIndex].optionType) {
      case 'Text':
        return 'Text';
      case 'Image URL':
        return 'Image URL';
      case 'Text & Image URL':
        return key === 'text' ? 'Text' : 'Image URL';
      default:
        return 'Option';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content qa-question-modal">
          <div className="question-nav">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`question-num ${index === currentQuestionIndex ? 'active' : ''}`}
                onClick={() => handleQuestionSelect(index)}
              >
                {index + 1}
              </div>
            ))}
            {questions.length < 5 && (
              <div className="add-question" onClick={handleAddQuestion}>
                +
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Enter Quiz Name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="quiz-name-input"
          />
          <input
            type="text"
            placeholder={quizType === 'Q&A' ? "Q&A Question" : "Poll Question"}
            value={questions[currentQuestionIndex].questionText}
            onChange={(e) => handleQuestionTextChange(e.target.value)}
            className="poll-question-input"
          />
          <div className="option-type-container">
            <label>Option Type</label>
            <label>
              <input
                type="radio"
                name="optionType"
                value="Text"
                checked={globalOptionType === 'Text'}
                onChange={() => handleOptionTypeChange('Text')}
              />
              Text
            </label>
            <label>
              <input
                type="radio"
                name="optionType"
                value="Image URL"
                checked={globalOptionType === 'Image URL'}
                onChange={() => handleOptionTypeChange('Image URL')}
              />
              Image URL
            </label>
            <label>
              <input
                type="radio"
                name="optionType"
                value="Text & Image URL"
                checked={globalOptionType === 'Text & Image URL'}
                onChange={() => handleOptionTypeChange('Text & Image URL')}
              />
              Text & Image URL
            </label>
          </div>
          <div className="options-container">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="option">
                {quizType === 'Q&A' && (
                  <input
                    type="radio"
                    name="correctOption"
                    checked={questions[currentQuestionIndex].correctOption === index}
                    onChange={() => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[currentQuestionIndex].correctOption = index;
                      setQuestions(updatedQuestions);
                    }}
                  />
                )}
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  placeholder={getPlaceholder('text')}
                  className="option-text-input"
                />
                {globalOptionType === 'Text & Image URL' && (
                  <input
                    type="text"
                    value={option.imageUrl}
                    onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
                    placeholder={getPlaceholder('imageUrl')}
                    className="option-image-input"
                  />
                )}
                {index > 0 && (
                  <button className="remove-option" onClick={() => handleRemoveOption(index)}>
                    🗑️
                  </button>
                )}
              </div>
            ))}
            {questions[currentQuestionIndex].options.length < 4 && (
              <button className="add-option" onClick={handleAddOption}>
                Add Option
              </button>
            )}
          </div>
          {quizType === 'Q&A' && (
            <div className="timer-container">
              <label>Timer</label>
              <button
                className={`timer-button ${questions[currentQuestionIndex].timer === 'OFF' ? 'active' : ''}`}
                onClick={() => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[currentQuestionIndex].timer = 'OFF';
                  setQuestions(updatedQuestions);
                }}
              >
                OFF
              </button>
              <button
                className={`timer-button ${questions[currentQuestionIndex].timer === '5 sec' ? 'active' : ''}`}
                onClick={() => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[currentQuestionIndex].timer = '5 sec';
                  setQuestions(updatedQuestions);
                }}
              >
                5 sec
              </button>
              <button
                className={`timer-button ${questions[currentQuestionIndex].timer === '10 sec' ? 'active' : ''}`}
                onClick={() => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[currentQuestionIndex].timer = '10 sec';
                  setQuestions(updatedQuestions);
                }}
              >
                10 sec
              </button>
            </div>
          )}
          <div className="modal-buttons">
            <button className="modal-button cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="modal-button continue-button"
              onClick={handleCreateQuiz}
            >
              Create Quiz
            </button>
          </div>
        </div>
      </div>

      <QuizPublishedModal
        isOpen={isQuizPublishedModalOpen}
        onClose={handleCloseQuizPublishedModal}
        quizLink={quizLink}
      />
    </>
  );
};

export default QAQuestionModal;
