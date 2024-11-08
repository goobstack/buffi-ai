import React, { useState } from 'react';
import { Send } from 'lucide-react';
import NavBar from '../common/NavBar.tsx'; // Import NavBar
import '../styles/chatInterface.css'; // Import the CSS file
import PORT from '../../serverPort.js';
import { useNavigate } from 'react-router-dom';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  planData?: any[]; // Update planData to be an array
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = inputMessage;
      setMessages([...messages, { text: userMessage, sender: 'user' }]);
      setInputMessage('');

      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:${PORT}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (response.status === 403) {
          setShowLoginPopup(true);
          return;
        }

        const data = await response.json();

        setMessages(prevMessages => [
          ...prevMessages,
          {
            text: typeof data.message === 'string' ? data.message : 'AI response error',
            sender: 'ai',
            planData: data.planData || [], // Ensure planData is an array
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
  const renderMessage = (message: string, planData?: any[]) => {
    // Remove <plan>...</plan> content from the displayed message
    const cleanedMessage = message.replace(/<plan>[\s\S]*?<\/plan>/g, '').trim();

    if (cleanedMessage) {
      return cleanedMessage.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ));
    } else if (planData && planData.length > 0) {
      // Render the plan data in a user-friendly format
      return planData.map((plan, idx) => (
        <div key={idx} className="plan-display">
          <h3>{plan.name}</h3>
          <p>{plan.description}</p>
          {/* Render meal or workout details */}
          {plan.planType === 'meal' ? (
            <div>
              <p><strong>Diet Type:</strong> {plan.diet_type}</p>
              <p><strong>Calorie Goal:</strong> {plan.calorie_goal}</p>
              {/* Render meals */}
              {plan.meals && plan.meals.length > 0 && (
                <div>
                  <h4>Meals:</h4>
                  {plan.meals.map((meal: any, mealIdx: number) => (
                    <p key={mealIdx}>
                      <strong>Day {meal.day}, {meal.meal_time}:</strong> {meal.meal}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p><strong>Goal:</strong> {plan.goal}</p>
              <p><strong>Level:</strong> {plan.level}</p>
              <p><strong>Duration:</strong> {plan.duration_weeks} weeks</p>
              {/* Render workouts */}
              {plan.workouts && plan.workouts.length > 0 && (
                <div>
                  <h4>Workouts:</h4>
                  {plan.workouts.map((workout: any, workoutIdx: number) => (
                    <div key={workoutIdx}>
                      <p><strong>Day {workout.day}:</strong></p>
                      {workout.exercises.map((exercise: any, exIdx: number) => (
                        <p key={exIdx}>
                          {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ));
    } else {
      return <p>No message to display.</p>;
    }
  };

  // Function to handle saving the plan
  const handleSavePlan = async (planData: any) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:${PORT}/api/savePlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan');
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
                    {message.sender === 'ai' ? renderMessage(message.text, message.planData) : <p>{message.text}</p>}
                    {/* Display Save Plan buttons if planData is available */}
                    {message.sender === 'ai' && message.planData && message.planData.length > 0 && (
                      message.planData.map((plan: any, idx: number) => (
                        <button
                          key={idx}
                          className="save-plan-button"
                          onClick={() => handleSavePlan(plan)}
                        >
                          Save {plan.planType === 'meal' ? 'Meal' : 'Workout'} Plan
                        </button>
                      ))
                    )}
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

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="login-popup">
          <p>You need to be logged in to use the chat feature.</p>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
