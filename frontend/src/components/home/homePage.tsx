import React from 'react';
import { Send } from 'lucide-react';
import NavBar from '../common/NavBar.tsx'; // Import NavBar
import '../styles/home.css'; // Import the CSS file

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header>
        <h1 className="logo">buffi</h1>
      </header>

      <div className="main-content">
        <NavBar /> {/* Use NavBar component here */}

        <main>
          <div className="chat-section">
            <div className="character-container">
              <img src="/logo_V1.png" alt="Buffi Character" className="character-image flipped" />
            </div>
            <div className="chat-container">
              <div className="chat-box">
                <div className="chat-header">Chat with Buffi AI</div>
                <div className="chat-messages">
                  <p className="placeholder-message">Start chatting with Buffi AI...</p>
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="message-input"
                  />
                  <button className="send-button">
                    <Send className="send-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Personalized Workouts</h3>
              <p>Tailored to your goals</p>
            </div>
            <div className="feature-card">
              <h3>Custom Meal Plans</h3>
              <p>Fuel your fitness journey</p>
            </div>
            <div className="feature-card">
              <h3>Progress Tracking</h3>
              <p>Monitor your achievements</p>
            </div>
          </div>
        </main>
      </div>

      <footer>
        <p>&copy; 2023 Buffi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
