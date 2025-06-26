import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Home, Camera, Globe, Satellite, Eye, MessageCircle, Star } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/apod', label: 'APOD', icon: Camera },
    { path: '/mars-rover', label: 'Mars Rover', icon: Rocket },
    { path: '/earth-imagery', label: 'Earth', icon: Globe },
    { path: '/neo', label: 'NEO', icon: Satellite },
    { path: '/epic', label: 'EPIC', icon: Eye },
    { path: '/donki', label: 'DONKI', icon: Star },
    { path: '/assistant', label: 'Assistant', icon: MessageCircle }
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <Rocket size={32} />
            <span>NASA Framework</span>
          </Link>
          
          <nav className="nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 