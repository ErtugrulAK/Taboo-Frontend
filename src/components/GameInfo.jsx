import React from 'react';

function GameInfo({ timeLeft, passCount, score }) {
  return (
    <div className="game-info">
      <div className="score">Score: {score}</div>
      <div className="timer">Time left: {timeLeft} s</div>
      <div className="passes">Passes left: {passCount}</div>
    </div>
  );
}

export default GameInfo;