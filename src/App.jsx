import React, { useEffect, useState, useRef } from "react";
import WordCard from "./components/WordCard";
import GameInfo from "./components/GameInfo";
import GameControls from "./components/GameControls";
import AIGuess from "./components/AIGuess";
import ChatBox from "./components/ChatBox";
import GameOver from "./components/GameOver";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState('notStarted');
  const [currentWord, setCurrentWord] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [passCount, setPassCount] = useState(3);
  const [score, setScore] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [aiGuess, setAiGuess] = useState("");
  const [combinedDescription, setCombinedDescription] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const [highlightedTaboos, setHighlightedTaboos] = useState([]);
  const timerRef = useRef(null);

  const API_URL = "http://127.0.0.1:8000";

  const fetchWord = (currentUsedWords) => {
    fetch(`${API_URL}/api/get-word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ used_words: currentUsedWords }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          alert(data.error);
          setGameState('gameOver');
        } else {
          setCurrentWord(data);
          setUsedWords(prevUsed => [...prevUsed, data.word]);
          setMessages([]);
          setAiGuess("");
          setCombinedDescription("");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Could not connect to the server. Please make sure the backend is running and try again.");
        setGameState('notStarted');
      });
  };

  const startGame = () => {
    const initialUsedWords = [];
    setUsedWords(initialUsedWords);
    setTimeLeft(60);
    setPassCount(3);
    setScore(0);
    setGameState('playing');
    fetchWord(initialUsedWords);
  };

  const handleRestart = () => {
    setGameState('notStarted');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timerRef.current);
          setGameState('gameOver');
          return 0;
        }
        return time - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const awardPointAndGetNextWord = () => {
    setScore(prevScore => prevScore + 1);
    fetchWord(usedWords);
  };

  const handlePass = () => {
    if (passCount > 0) {
      setPassCount(passCount - 1);
      fetchWord(usedWords);
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
      setScore(prevScore => Math.max(0, prevScore - 1));
      const usedTabooWords = checkResult.used_taboo_words;
      setHighlightedTaboos(usedTabooWords);

      const warningText = `Taboo word used: ${usedTabooWords.join(", ")}`;
      setMessages((prev) => [...prev, { sender: "system", text: warningText }]);
      
      setTimeout(() => {
        setHighlightedTaboos([]);
        fetchWord(usedWords);
      }, 1500);

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
      awardPointAndGetNextWord();
    } else {
      setMessages((prev) => [...prev, { sender: "system", text: "Incorrect guess. Add more description." }]);
      setAiGuess("");
    }
  };

  const renderGameContent = () => {
    if (gameState === 'gameOver') {
      return <GameOver score={score} onRestart={handleRestart} />;
    }

    if (gameState === 'playing') {
      return (
        <>
          <GameInfo timeLeft={timeLeft} passCount={passCount} score={score} />

          {currentWord ? (
            <WordCard 
              key={currentWord.word}
              word={currentWord.word} 
              taboo={currentWord.taboo} 
              highlightedTaboos={highlightedTaboos}
            />
          ) : (
            <p>Loading word...</p>
          )}

          <GameControls onPass={handlePass} passCount={passCount} />

          <AIGuess guess={aiGuess} onFeedback={handleGuessFeedback} />

          <ChatBox
            messages={messages}
            input={input}
            onInputChange={(e) => setInput(e.target.value)}
            onSendMessage={handleSendMessage}
          />
        </>
      );
    }

    return (
      <button className="start-button" onClick={startGame}>
        Start Game
      </button>
    );
  };

  return (
    <div className="app">
      <h1>AI Taboo Game</h1>
      {renderGameContent()}
    </div>
  );
}

export default App;