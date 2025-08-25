import React from 'react';

function GameInfo({ timeLeft, passCount, score }) {
  return (
    <div className="game-info">
      <div className="score">Score: {score}</div>
      <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
        Time left: {timeLeft} s
      </div>
      <div className="passes">Passes left: {passCount}</div>
    </div>
  );
}

export default GameInfo;