import React from 'react';

function WordCard({ word, taboo, highlightedTaboos = [] }) {
  return (
    <div className="card">
      <div className="main-word">{word.toUpperCase()}</div>
      <ul className="taboo-list">
        {taboo.map((item, index) => (
          <li 
            key={index} 
            className={highlightedTaboos.includes(item) ? "taboo-highlight" : ""}
          >
            {item.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WordCard;