# 🚀 NASA Framework - Setup Instructions

Congratulations! Your NASA Framework project has been created successfully. Follow these steps to complete the setup and get it running.

## 📋 Prerequisites

1. **Install Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Install Git** (for version control)
   - Download from [git-scm.com](https://git-scm.com/)

3. **Get a NASA API Key**
   - Visit [https://api.nasa.gov/](https://api.nasa.gov/)
   - Sign up for a free API key

4. **Install Python** (required for ML-powered image enhancement, even for the stub)
   - Download from [python.org](https://www.python.org/)

## 🔧 Setup Steps

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: NASA Framework with React frontend and Node.js backend"
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Configure Environment Variables
```bash
# Copy the example environment file
copy server\env.example server\.env

# Edit server\.env and add your NASA API key
# Replace 'your_nasa_api_key_here' with your actual NASA API key
```

### 4. Start the Development Servers
```bash
npm run dev
```

### 5. Open Your Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 What You Have

### Frontend Features
- **Home Page** - Overview of all NASA data features
- **APOD** - Astronomy Picture of the Day with date selection
- **Mars Rover Photos** - Browse photos from Curiosity, Opportunity, Spirit, and Perseverance
- **Earth Imagery** - Satellite images of Earth by coordinates
- **NEO** - Near Earth Objects tracking
- **EPIC** - Daily Earth images from DSCOVR satellite

### Backend API Endpoints
- `GET /api/health` - Health check
- `GET /api/apod` - Astronomy Picture of the Day
- `GET /api/mars-rover` - Mars Rover Photos
- `GET /api/earth-imagery` - Earth Imagery
- `GET /api/neo` - Near Earth Objects
- `GET /api/epic` - EPIC Earth Images
- `POST /api/enhance-image` - ML-powered image enhancement (Super-Resolution, stub)

### Tech Stack
- **Frontend**: React.js, React Router, Axios, Lucide React, Date-fns
- **Backend**: Node.js, Express.js, Axios, CORS, Helmet, Morgan
- **APIs**: NASA's official space data APIs

## 🚀 Deployment Options

### Option 1: Vercel + Railway (Recommended)
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- See `DEPLOYMENT.md` for detailed instructions

### Option 2: Netlify + Heroku
- Frontend: Deploy to Netlify
- Backend: Deploy to Heroku

### Option 3: Full Stack on Railway
- Deploy both frontend and backend on Railway

## 📁 Project Structure
```
nasa_framework/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── package.json
│   └── env.example
├── package.json           # Root package.json
├── README.md
├── DEPLOYMENT.md
└── SETUP_INSTRUCTIONS.md
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start only backend
- `npm run client` - Start only frontend
- `npm run build` - Build React app for production
- `npm run install-all` - Install all dependencies

## 🎨 Features

### Modern UI/UX
- Responsive design for all devices
- Dark space theme with gradients
- Smooth animations and transitions
- Beautiful icons from Lucide React
- Card-based layout with hover effects

### NASA API Integration
- Real-time data from NASA's official APIs
- Error handling and loading states
- Image downloads and external links
- Comprehensive filtering and search options

### Performance
- Optimized image loading
- Efficient API calls
- Modern React patterns
- Clean code architecture

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**
   - Kill processes on ports 3000 and 5000
   - Or change ports in package.json

2. **NASA API errors**
   - Verify your API key is correct
   - Check API rate limits

3. **Build errors**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

### Getting Help
- Check the `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for deployment help
- Open an issue on GitHub if needed

## 🎉 Next Steps

1. **Test all features** - Make sure everything works as expected
2. **Customize the design** - Modify colors, fonts, or layout
3. **Add new features** - Extend with additional NASA APIs
4. **Deploy to production** - Follow the deployment guide
5. **Share your project** - Show off your space exploration app!

## 📞 Support

If you need help:
1. Check the documentation files
2. Review the code comments
3. Test with different NASA API endpoints
4. Consider adding more features or improvements

---

**Happy coding and space exploring! 🚀✨**

Your NASA Framework is ready to explore the cosmos! 🌌 