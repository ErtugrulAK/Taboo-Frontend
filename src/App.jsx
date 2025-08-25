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
  const [aiGuess, setAiGuess] = useState("");
  const [combinedDescription, setCombinedDescription] = useState("");
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
    setAiGuess("");
    setCombinedDescription("");
    setIsStarted(true);
    fetchWord(initialUsedWords);
  };

  const getNextWord = () => {
    setMessages([]);
    setInput("");
    setAiGuess("");
    setCombinedDescription("");
    fetchWord(usedWords);
  };

  const handlePass = () => {
    if (passCount > 0) {
      setPassCount(passCount - 1);
      getNextWord();
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || !currentWord) return;

    const userMessage = input;
    const newCombinedDescription = combinedDescription ? `${combinedDescription} ${userMessage}` : userMessage;

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setCombinedDescription(newCombinedDescription);

    const checkResponse = await fetch(`${API_URL}/api/check-description`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_word: currentWord.word,
        description: userMessage,
      }),
    });
    const checkResult = await checkResponse.json();

    if (!checkResult.isvalid) {
      const warningText = `Warning! Taboo word used: ${checkResult.used_taboo_words.join(", ")}`;
      setMessages((prev) => [...prev, { sender: "system", text: warningText }]);
      return;
    }

    const guessResponse = await fetch(`${API_URL}/api/guess-word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newCombinedDescription }),
    });
    const guessResult = await guessResponse.json();
    setAiGuess(guessResult.guess);
  };

  const handleGuessFeedback = (isCorrect) => {
    if (isCorrect) {
      setMessages((prev) => [...prev, { sender: "system", text: `Correct! The word was ${currentWord.word}.` }]);
      getNextWord();
    } else {
      setMessages((prev) => [...prev, { sender: "system", text: "Incorrect guess. Add more description." }]);
      setAiGuess("");
    }
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
          <AIGuess guess={aiGuess} onFeedback={handleGuessFeedback} />
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