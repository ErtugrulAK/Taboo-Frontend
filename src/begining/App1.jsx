/*
import React, { useState, useEffect } from "react";
import WordCard1 from "./WordCard1";
import "./App1.css";

function App1() {
  const [cards, setCards] = useState({});
  const [currentWord, setCurrentWord] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [passes, setPasses] = useState(3);

  useEffect(() => {
    fetch("/taboo_words.json")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  useEffect(() => {
    let timer;
    if (started) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            nextWord();
            return 60;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started]);

  function startGame() {
    setStarted(true);
    setTimeLeft(60);
    setPasses(3);
    nextWord();
  }

  function nextWord() {
    const keys = Object.keys(cards);
    if (keys.length > 0) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setCurrentWord({ word: randomKey, taboo: cards[randomKey] });
    }
  }

  function passWord() {
    if (passes > 0) {
      setPasses(passes - 1);
      nextWord();
    }
  }

  return (
    <div className="app">
      <h1>Taboo Game</h1>
      {!started && <button onClick={startGame}>Start Game</button>}

      {started && (
        <>
          <div>Time Left: {timeLeft}</div>
          <div>Passes Left: {passes}</div>

          {currentWord ? (
            <WordCard1 word={currentWord.word} taboo={currentWord.taboo} />
          ) : (
            <div>Loading...</div>
          )}

          <button onClick={nextWord}>Next</button>
          <button onClick={passWord} disabled={passes === 0}>
            Pass
          </button>
        </>
      )}
    </div>
  );
}

export default App1;
*/
