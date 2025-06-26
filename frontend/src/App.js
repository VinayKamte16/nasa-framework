import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import APOD from './components/APOD';
import MarsRover from './components/MarsRover';
import EarthImagery from './components/EarthImagery';
import NEO from './components/NEO';
import EPIC from './components/EPIC';
import ChatAssistant from './components/ChatAssistant';
import './App.css';

function App() {
  useEffect(() => {
    // Remove any existing stars
    document.querySelectorAll('.star').forEach(el => el.remove());
    // Generate 120 stars
    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.left = `${Math.random() * 100}vw`;
      star.style.opacity = Math.random() * 0.5 + 0.5;
      star.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      document.body.appendChild(star);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apod" element={<APOD />} />
            <Route path="/mars-rover" element={<MarsRover />} />
            <Route path="/earth-imagery" element={<EarthImagery />} />
            <Route path="/neo" element={<NEO />} />
            <Route path="/epic" element={<EPIC />} />
            <Route path="/assistant" element={<ChatAssistant />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 