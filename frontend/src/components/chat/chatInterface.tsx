import React, { useState } from 'react';
import { Send } from 'lucide-react';
import NavBar from '../common/NavBar.tsx'; // Import NavBar
import '../styles/chatInterface.css'; // Import the CSS file
import PORT from '../../serverPort.js';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = inputMessage;
      setMessages([...messages, { text: userMessage, sender: 'user' }]);
      setInputMessage('');

      try {
        const response = await fetch(`http://localhost:${PORT}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            text: typeof data.message === 'string' ? data.message : 'AI response error', 
            sender: 'ai' 
          }
        ]);        
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Error: Could not connect to AI', sender: 'ai' }
        ]);
      }
    }
  };

  // Function to display AI messages with line breaks
  const renderMessage = (message: string) => {
    return message.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ));
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
                    {message.sender === 'ai' ? renderMessage(message.text) : message.text}
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
