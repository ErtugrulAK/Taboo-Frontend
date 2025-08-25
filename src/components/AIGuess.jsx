import React from 'react';

function AIGuess({ guess, onFeedback }) {
  if (!guess) {
    return null;
  }

  return (
    <div className="ai-guess-box">
      <p className="ai-guess-text">
        AI Guess: <strong>{guess}</strong>
      </p>
      <div className="feedback-buttons">
        <button className="true-button" onClick={() => onFeedback(true)}>
          True
        </button>
        <button className="false-button" onClick={() => onFeedback(false)}>
          False
        </button>
      </div>
    </div>
  );
}

export default AIGuess;