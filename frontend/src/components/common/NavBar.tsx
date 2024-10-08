import React, { useState } from 'react';
import { Home, Dumbbell, Utensils, MessageCircle, BarChart2, User } from 'lucide-react';
import '../styles/navBar.css'; 

const NavBar: React.FC = () => {
  const [expandedMenu, setExpandedMenu] = useState(false);

  const navItems = [
    { icon: <Home className="nav-icon" />, shortName: "Home", fullName: "Dashboard" },
    { icon: <Dumbbell className="nav-icon" />, shortName: "Work", fullName: "Workouts" },
    { icon: <Utensils className="nav-icon" />, shortName: "Plan", fullName: "Meal Plans" },
    { icon: <MessageCircle className="nav-icon" />, shortName: "Chat", fullName: "AI Chat" },
    { icon: <BarChart2 className="nav-icon" />, shortName: "Prog", fullName: "Progress" },
    { icon: <User className="nav-icon" />, shortName: "Prof", fullName: "Profile" }
  ];

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
    </nav>
  );
};

export default NavBar;
