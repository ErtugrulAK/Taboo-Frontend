import React, { useEffect, useState, useRef } from "react";
import WordCard from "./components/WordCard";
import GameInfo from "./components/GameInfo";
import GameControls from "./components/GameControls";
import "./App.css";

function App() {
  const [cards, setCards] = useState({});
  const [currentWord, setCurrentWord] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [passCount, setPassCount] = useState(3);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("/taboo_words.json")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      });
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((time) => {
        if (time === 1) {
          getNextWord();
          return 60;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isStarted]);

  const startGame = () => {
    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCurrentWord({ word: randomKey, taboo: cards[randomKey] });
    setTimeLeft(60);
    setPassCount(3);
    setIsStarted(true);
  };

  const getNextWord = () => {
    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCurrentWord({ word: randomKey, taboo: cards[randomKey] });
  };

  const handlePass = () => {
    if (passCount > 0) {
      setPassCount(passCount - 1);
      getNextWord();
    }
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className="app">
      <h1>Play Taboo</h1>
      {!isStarted ? (
        <button className="start-button" onClick={startGame}>
          Start
        </button>
      ) : (
        <>
          <GameInfo timeLeft={timeLeft} passCount={passCount} />
          {currentWord ? (
            <WordCard word={currentWord.word} taboo={currentWord.taboo} />
          ) : (
            <p>Loading...</p>
          )}
          <GameControls onNext={getNextWord} onPass={handlePass} passCount={passCount} />
          <div className="chatbox">
            <div className="messages">
              {messages.length === 0 ? (
                <p className="no-messages">No messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="message">
                    {msg}
                  </div>
                ))
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;