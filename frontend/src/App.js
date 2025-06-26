import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import APOD from './components/APOD';
import MarsRover from './components/MarsRover';
import EarthImagery from './components/EarthImagery';
import NEO from './components/NEO';
import EPIC from './components/EPIC';
import ChatAssistant from './components/ChatAssistant';
import DONKI from './components/DONKI';
import './App.css';

function App() {
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
            <Route path="/donki" element={<DONKI />} />
            <Route path="/assistant" element={<ChatAssistant />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 