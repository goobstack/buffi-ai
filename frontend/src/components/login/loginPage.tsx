import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to redirect after login
import '../styles/loginPage.css'; // Import the CSS file
import PORT from '../../serverPort.js';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Track errors
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset any previous error messages

    try {
      const response = await fetch(`http://localhost:${PORT}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Redirect to another page (e.g., dashboard) after successful login
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Set the error message from the response
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Error during login:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
