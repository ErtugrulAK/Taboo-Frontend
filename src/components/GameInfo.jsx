import React from 'react';

function GameInfo({ timeLeft, passCount }) {
  return (
    <div className="game-info">
      <div className="timer">Time left: {timeLeft} s</div>
      <div className="passes">Passes left: {passCount}</div>
    </div>
  );
}

export default GameInfo;