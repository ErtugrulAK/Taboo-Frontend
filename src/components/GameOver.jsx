import React from 'react';

function GameOver({ score, onRestart }) {
  return (
    <div className="game-over-container">
      <h2>Game Over!</h2>
      <p className="final-score">Your Final Score: {score}</p>
      <button className="restart-button" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}

export default GameOver;