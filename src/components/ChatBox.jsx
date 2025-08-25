import React from 'react';

function ChatBox({ messages, input, onInputChange, onSendMessage }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={onSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;