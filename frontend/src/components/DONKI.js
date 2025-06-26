import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './APOD.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const DONKI = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Example: Fetch CME events for the last 30 days
        const today = new Date();
        const start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const startDate = start.toISOString().slice(0, 10);
        const endDate = today.toISOString().slice(0, 10);
        const res = await axios.get(`https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=DEMO_KEY`);
        setEvents(res.data);
      } catch (err) {
        setError('Failed to fetch DONKI data.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Prepare data for chart
  const chartData = {
    labels: events.map(e => e.startTime ? e.startTime.slice(0, 10) : 'Unknown'),
    datasets: [
      {
        label: 'CME Events',
        data: events.map(e => e.cmeAnalyses?.length || 0),
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: '#667eea',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'CME Events (Last 30 Days)' },
    },
  };

  // AI Assistant (simple, compatible with rest of framework)
  const handleAiAsk = async () => {
    setAiResponse('Thinking...');
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: aiInput })
      });
      const data = await res.json();
      setAiResponse(data.reply || data.error);
    } catch (err) {
      setAiResponse('Sorry, there was an error.');
    }
  };

  return (
    <div className="apod">
      <div className="page-header">
        <h1>NASA DONKI API Visualizations</h1>
        <p>Data from NASA's DONKI (Space Weather Database Of Notifications, Knowledge, Information) API</p>
      </div>
      {loading ? (
        <div className="loading">Loading DONKI data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Bar data={chartData} options={chartOptions} />
          <div style={{ marginTop: 32 }}>
            <Line data={chartData} options={{ ...chartOptions, title: { display: true, text: 'CME Events Trend' } }} />
          </div>
        </div>
      )}
      <div style={{ marginTop: 48, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2>Ask the AI about Space Weather</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            placeholder="Ask about CME events, solar storms, etc..."
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #667eea' }}
          />
          <button className="btn" onClick={handleAiAsk} disabled={!aiInput.trim()}>Ask</button>
        </div>
        {aiResponse && <div className="card" style={{ marginTop: 8 }}>{aiResponse}</div>}
      </div>
    </div>
  );
};

export default DONKI; 