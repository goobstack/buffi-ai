import React from 'react';
import './index.css';  // Ensure the path to index.css is correct

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/home/homePage.tsx';
import WorkoutPlan from './components/workoutplan/workout-plan.tsx';
import ChatInterface from './components/chat/chatInterface.tsx';
import MealPlanPage from './components/mealplan/mealPlan.tsx';



function App() {
  return (
    <Router>
      <Routes>
        {/* Default route, redirect to home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Home Page */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/work" element={<WorkoutPlan />} />
        <Route path="/chat" element={<ChatInterface/>} />
        <Route path="/plan" element={<MealPlanPage/>} />

        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
