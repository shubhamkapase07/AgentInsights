import React, { useState, useEffect } from 'react';
import questionsData from '../questions.json';
import BlockerPopup from './BlockerPopup';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [violations, setViolations] = useState(0);
  const [marks, setMarks] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setViolations(violations + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [violations]);

  const startFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  };

  const handleAnswer = (selectedOption) => {
    if (!isFullScreen) return; // Don't allow answering if not in full screen
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer === selectedOption;
    setAnswers({ ...answers, [currentQuestionIndex]: isCorrect });
    if (isCorrect) {
      setMarks(marks + 1);
    }
    // Move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
        setViolations(0); // Reset violations when entering full screen
        setCurrentQuestionIndex(0); // Reset quiz when entering full screen
        setMarks(0);
        setAnswers({});
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <div className="quiz-container">
      {(!isFullScreen || document.fullscreenElement === null) && <BlockerPopup />}
      <button className="fullscreen-button" onClick={startFullScreen}>Start Full Screen</button>
      {isFullScreen && currentQuestionIndex < questions.length ? (
        <div className="question-container">
          <h2 className="question-number">Question {currentQuestionIndex + 1}</h2>
          <p className="question">{questions[currentQuestionIndex]?.question}</p>
          <ul className="options">
            {questions[currentQuestionIndex]?.options.map((option, index) => (
              <li key={index} className="option" onClick={() => handleAnswer(option)}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        isFullScreen && <div className="result-container">
          <p className="result">Your marks: {marks} out of {questions.length}</p>
        </div>
      )}
      <p className="violations">Violations: {violations}</p>
    </div>
  );
};

export default Quiz;
