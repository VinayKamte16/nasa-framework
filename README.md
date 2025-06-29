# 🚀 NASA Framework

A modern full-stack web application to explore NASA's APIs, including space imagery, Mars rover photos, Earth satellite images, and more.  
Built with React (frontend) and Node.js/Express (backend).

---

## ✨ Features

- **Astronomy Picture of the Day (APOD)**
- **Mars Rover Photos**
- **Earth Imagery**
- **Near Earth Objects (NEO)**
- **EPIC Earth Images**
- **ML-powered image enhancement (stub)**
- **Responsive design** for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Axios, Swiper, Lucide Icons, CSS3
- **Backend:** Node.js, Express, Axios, Helmet, CORS, Morgan, dotenv
- **APIs:** NASA (APOD, Mars Rover, Earth Imagery, NEO, EPIC), OpenAI (optional)

---

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- NASA API key ([get one here](https://api.nasa.gov/))
- (Optional) OpenAI API key for assistant

---

## 🚀 Getting Started (Local Development)

### 1. **Clone the repository**
```bash
git clone https://github.com/VinayKamte16/nasa-framework.git
cd nasa-framework
```

### 2. **Install dependencies**
```bash
npm run install-all
```

### 3. **Set up environment variables**
```bash
# Copy example env file
cp backend/env.example backend/.env

# Edit backend/.env and add your NASA API key
NASA_API_KEY=your_nasa_api_key_here
```

### 4. **Start the app (dev mode)**
```bash
npm run dev
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🖥️ Using the Application

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Explore APOD, Mars Rover, Earth Imagery, NEO, and EPIC features.
- Use the date pickers and filters to browse NASA data.
- Download images or try the ML-powered enhancement (stub).

---

## 🌐 Deployment

### **Frontend (Vercel)**
1. Push your code to GitHub.
2. Import the repo in [Vercel](https://vercel.com/).
3. Set the project root to `frontend`.
4. Set environment variable:  
   `REACT_APP_API_URL=https://<your-backend-on-render>.onrender.com`
5. Deploy!

### **Backend (Render)**
1. Import your repo in [Render](https://render.com/).
2. Create a new **Web Service**:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
3. Set environment variables:
   - `NASA_API_KEY=your_nasa_api_key_here`
   - `NODE_ENV=production`
4. Deploy!

---

## ⚙️ Environment Variables

**Backend (`backend/.env`):**
```
NASA_API_KEY=your_nasa_api_key_here
PORT=5000
NODE_ENV=production
```

**Frontend (Vercel):**
```
REACT_APP_API_URL=https://<your-backend-on-render>.onrender.com
```

---

## 📁 Project Structure

```
nasa-framework/
├── frontend/         # React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/          # Node.js/Express app
│   ├── ml/
│   ├── index.js
│   ├── package.json
│   └── env.example
├── README.md
└── .gitignore
```

---

## 🔧 Scripts

**Root:**
- `npm run dev` — Start both frontend and backend (dev)
- `npm run install-all` — Install all dependencies

**Frontend:**
- `npm start` — Start React dev server
- `npm run build` — Build for production

**Backend:**
- `npm run dev` — Start backend with nodemon
- `npm start` — Start backend in production

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

- [NASA APIs](https://api.nasa.gov/)
- [OpenAI](https://openai.com/) (for assistant)
- All open-source contributors

---

## 📞 Support

- Open an issue on GitHub for help or questions.

---

**Mainted by Vinay Kamte for space enthusiasts!** 