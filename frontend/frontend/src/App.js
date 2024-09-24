import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/home/homePage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route, redirect to home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Home Page */}
        <Route path="/home" element={<HomePage />} />

        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
