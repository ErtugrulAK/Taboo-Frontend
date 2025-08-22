import React from 'react';

function GameControls({ onNext, onPass, passCount }) {
  return (
    <div className="buttons">
      <button onClick={onNext}>Next ▶</button>
      <button
        onClick={onPass}
        disabled={passCount === 0}
        className={`pass-button ${passCount === 0 ? "disabled" : ""}`}
      >
        Pass
      </button>
    </div>
  );
}

export default GameControls;