import React, { useState, useEffect } from 'react';
import { Home, Dumbbell, Utensils, MessageCircle, BarChart2, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // If you're using react-router for navigation
import '../styles/navBar.css'; 

const NavBar: React.FC = () => {
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // To programmatically navigate

  // Check if a user is logged in by checking the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set the login state based on the presence of the token
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update the login state
    navigate('/login'); // Redirect to the login page
  };

  const navItems = [
    { icon: <Home className="nav-icon" />, shortName: "Home", fullName: "Dashboard" },
    { icon: <Dumbbell className="nav-icon" />, shortName: "Work", fullName: "Workouts" },
    { icon: <Utensils className="nav-icon" />, shortName: "Plan", fullName: "Meal Plans" },
    { icon: <MessageCircle className="nav-icon" />, shortName: "Chat", fullName: "AI Chat" },
    { icon: <BarChart2 className="nav-icon" />, shortName: "Prog", fullName: "Progress" },
  ];

  // Handle profile navigation based on login state
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/prof'); // Go to profile page if logged in
    } else {
      navigate('/login'); // Redirect to login page if not logged in
    }
  };

  return (
    <nav 
      className={`side-nav ${expandedMenu ? 'expanded' : ''}`}
      onMouseEnter={() => setExpandedMenu(true)}
      onMouseLeave={() => setExpandedMenu(false)}
    >
      {navItems.map((item, index) => (
        <a href={`/${item.shortName.toLowerCase()}`} key={index} className="nav-item">
          {item.icon}
          <span className="nav-text">{item.fullName}</span>
        </a>
      ))}
      
      {/* Profile icon */}
      <div className="nav-item" onClick={handleProfileClick}>
        <User className="nav-icon" />
        <span className="nav-text">Profile</span>
      </div>

      {/* If the user is logged in, show the logout button */}
      {isLoggedIn && (
        <div className="nav-item" onClick={handleLogout}>
          <LogOut className="nav-icon" />
          <span className="nav-text">Logout</span>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
