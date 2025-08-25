import React from 'react';

function GameControls({ onPass, passCount }) {
  return (
    <div className="buttons">
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