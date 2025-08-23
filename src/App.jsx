import React, { useEffect, useState, useRef } from "react";
import WordCard from "./components/WordCard";
import GameInfo from "./components/GameInfo";
import GameControls from "./components/GameControls";
import ChatBox from "./components/ChatBox";
import AIGuess from "./components/AIGuess";
import "./App.css";

function App() {
  const [currentWord, setCurrentWord] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [passCount, setPassCount] = useState(3);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const timerRef = useRef(null);

  const API_URL = "http://127.0.0.1:8000";

  const fetchWord = (currentUsedWords) => {
    fetch(`${API_URL}/api/get-word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ used_words: currentUsedWords }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          setIsStarted(false);
        } else {
          setCurrentWord(data);
          setUsedWords(prevUsed => [...prevUsed, data.word]);
        }
      });
  };

  useEffect(() => {
    if (!isStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((time) => {
        if (time === 1) {
          clearInterval(timerRef.current);
          setIsStarted(false);
          alert("Time is up!");
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isStarted]);

  const startGame = () => {
    const initialUsedWords = [];
    setUsedWords(initialUsedWords);
    setTimeLeft(60);
    setPassCount(3);
    setMessages([]);
    setInput("");
    setIsStarted(true);
    fetchWord(initialUsedWords);
  };

  const getNextWord = () => {
    fetchWord(usedWords);
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
          <AIGuess />
          <ChatBox
            messages={messages}
            input={input}
            onInputChange={(e) => setInput(e.target.value)}
            onSendMessage={handleSendMessage}
          />
        </>
      )}
    </div>
  );
}

export default App;