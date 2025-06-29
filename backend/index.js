const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('CORS Origin:', process.env.FRONTEND_URL);
// Middleware
app.use(helmet());
app.use(cors({
  origin: "https://nasa-framework.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NASA API Configuration
 const NASA_API_KEY = process.env.NASA_API_KEY;
console.log('Using NASA_API_KEY:', NASA_API_KEY);
const NASA_BASE_URL = 'https://api.nasa.gov';

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NASA Framework API is running' });
});

// APOD (Astronomy Picture of the Day)
app.get('/api/apod', async (req, res) => {
  try {
    const { date, count, thumbs } = req.query;
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      ...(date && { date }),
      ...(count && { count }),
      ...(thumbs && { thumbs })
    });

    const response = await axios.get(`${NASA_BASE_URL}/planetary/apod?${params}`);
    console.log('APOD Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('APOD API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch APOD data' });
  }
});

// Mars Rover Photos
app.get('/api/mars-rover', async (req, res) => {
  try {
    const { rover, sol, earth_date, camera, page } = req.query;
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      ...(sol && { sol }),
      ...(earth_date && { earth_date }),
      ...(camera && { camera }),
      ...(page && { page })
    });

    const roverName = rover || 'curiosity';
    const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/${roverName}/photos?${params}`);
    res.json(response.data);
  } catch (error) {
    console.error('Mars Rover API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Mars Rover data' });
  }
});

// Earth Imagery
app.get('/api/earth-imagery', async (req, res) => {
  try {
    const { lat, lon, date, dim } = req.query;
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      lat,
      lon,
      ...(date && { date }),
      ...(dim && { dim })
    });

    const response = await axios.get(`${NASA_BASE_URL}/planetary/earth/imagery?${params}`);
    res.json(response.data);
  } catch (error) {
    console.error('Earth Imagery API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Earth Imagery data' });
  }
});

// NeoWs (Near Earth Object Web Service)
app.get('/api/neo', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      start_date: start_date || new Date().toISOString().split('T')[0],
      end_date: end_date || new Date().toISOString().split('T')[0]
    });

    const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed?${params}`);
    res.json(response.data);
  } catch (error) {
    console.error('NeoWs API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  }
});

// EPIC (Earth Polychromatic Imaging Camera)
app.get('/api/epic', async (req, res) => {
  try {
    const { date } = req.query;
    let url = `${NASA_BASE_URL}/EPIC/api/natural`;
    if (date) {
      url += `/date/${date}`;
    }
    const params = new URLSearchParams({
      api_key: NASA_API_KEY
    });
    const response = await axios.get(`${url}?${params}`);
    res.json(response.data);
  } catch (error) {
    console.error('EPIC API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch EPIC data' });
  }
});

// Natural Language Assistant (OpenRouter API)
app.post('/api/assistant', async (req, res) => {
  const { message } = req.body;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct:free",
        messages: [{ role: "user", content: message }]
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter API bad response:', errText);
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";
    
    // Return the JSON response in the requested format
    const jsonResponse = {
      "model": "mistralai/mistral-small-3.2-24b-instruct",
      "messages": [
        {
          "role": "user",
          "content": message
        },
        {
          "role": "assistant",
          "content": reply
        }
      ]
    };
    
    res.json(jsonResponse);
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    res.status(500).json({ error: 'Failed to get assistant response' });
  }
});

// ML-Powered Image Enhancement (Stub)
app.post('/api/enhance-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Missing imageUrl' });
    }
    // Call the ESRGAN stub script
    const scriptPath = path.join(__dirname, 'ml', 'esrgan_stub.py');
    const python = spawn('python', [scriptPath, imageUrl]);
    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    python.stderr.on('data', (data) => {
      console.error('ESRGAN Stub Error:', data.toString());
    });
    python.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Enhancement failed' });
      }
      // The stub script returns a dummy enhanced image URL
      res.json({ enhancedUrl: output.trim() });
    });
  } catch (error) {
    console.error('Enhance Image API Error:', error.message);
    res.status(500).json({ error: 'Failed to enhance image' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(` NASA Framework Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 