import React, { useState } from 'react';
import { Send } from 'lucide-react';
import NavBar from '../common/NavBar.tsx'; // Import NavBar
import '../styles/chatInterface.css'; // Import the CSS file

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: "This is a simulated AI response.", sender: 'ai' }]);
      }, 1000);
    }
  };

  return (
    <div className="home-page">
      <header>
        <h1 className="logo">buffi</h1>
      </header>

      <div className="main-content">
        <NavBar /> {/* Use NavBar component here */}

        <main className="chat-interface">
          <div className="chat-container">
            <div className="chat-messages">
              {messages.length === 0 ? (
                <p className="placeholder-message">Start chatting with Buffi AI...</p>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender}`}>
                    {message.text}
                  </div>
                ))
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <Send size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;
