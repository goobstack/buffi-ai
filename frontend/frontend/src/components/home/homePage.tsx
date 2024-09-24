import React from 'react';
import '../styles/home.css'
import { Button } from '../common/Button.tsx';
import { Card, CardContent } from "../common/Card.tsx";
import { User, Dumbbell, Utensils, FileText, MessageCircle } from 'lucide-react';
import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_V1-k4EYKtmkx6kcOPIIgdjNPN1Om1bRoW.png" alt="Buffi Logo" className="logo" />
        </div>
        <div className="user-icon">
          <Button variant="ghost" size="icon">
            <User className="icon" />
          </Button>
        </div>
      </header>

      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/workout" className="nav-item">Workouts</Link></li>
          <li><Link to="/meal" className="nav-item">Meal Plans</Link></li>
          <li><Link to="/chat" className="nav-item active">AI Chat</Link></li>
          <li><Link to="/profile" className="nav-item">Profile</Link></li>
        </ul>
      </nav>

      <main className="main">
        <div className="intro">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_V1-k4EYKtmkx6kcOPIIgdjNPN1Om1bRoW.png" alt="Buffi Logo" className="intro-logo" />
          <h2 className="title">Welcome to Buffi</h2>
          <p className="subtitle">Your AI-powered personal trainer for a stronger, healthier you.</p>
        </div>

        <Card className="ai-chat-card">
          <CardContent className="ai-chat-content">
            <MessageCircle className="ai-chat-icon" />
            <h3 className="ai-chat-title">AI Chat Support</h3>
            <p className="ai-chat-subtitle">Get real-time advice and answers from our AI personal trainer. Start a conversation now!</p>
            <Button className="ai-chat-button">Chat with Buffi AI</Button>
          </CardContent>
        </Card>

        <div className="features-grid">
          <Card className="feature-card">
            <CardContent className="feature-content">
              <Dumbbell className="feature-icon" />
              <h3 className="feature-title">Personalized Workouts</h3>
              <p className="feature-description">Tailored to your goals</p>
            </CardContent>
          </Card>
          <Card className="feature-card">
            <CardContent className="feature-content">
              <Utensils className="feature-icon" />
              <h3 className="feature-title">Custom Meal Plans</h3>
              <p className="feature-description">Fuel your fitness journey</p>
            </CardContent>
          </Card>
          <Card className="feature-card">
            <CardContent className="feature-content">
              <FileText className="feature-icon" />
              <h3 className="feature-title">Progress Tracking</h3>
              <p className="feature-description">Monitor your achievements</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2023 Buffi. All rights reserved.</p>
      </footer>
    </div>
  );
}
