# 🚀 NASA Framework

A comprehensive web application that integrates multiple NASA APIs to provide users with access to space data, imagery, and scientific information. Built with React and Node.js, it offers a modern, responsive interface for exploring the wonders of space.

## ✨ Features

- **Astronomy Picture of the Day (APOD)** - Daily featured space imagery with detailed explanations
- **Mars Rover Photos** - Explore the Red Planet through NASA's Mars rovers (Curiosity, Opportunity, Spirit, Perseverance)
- **Earth Imagery** - High-resolution satellite imagery of Earth from space
- **Near Earth Objects (NEO)** - Track asteroids and comets that approach Earth's orbit
- **EPIC Earth Images** - Daily natural color imagery from the EPIC camera aboard DSCOVR satellite
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data** - Live data from NASA's official APIs
- **Image Downloads** - Download high-resolution images for personal use

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **Date-fns** - Date utility library
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Axios** - HTTP client for NASA API requests
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### APIs
- **NASA APIs** - Official space data sources
  - APOD API
  - Mars Rover Photos API
  - Earth Imagery API
  - NeoWs (Near Earth Object Web Service)
  - EPIC (Earth Polychromatic Imaging Camera)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- NASA API key (get one at [https://api.nasa.gov/](https://api.nasa.gov/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nasa_framework
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit server/.env and add your NASA API key
   NASA_API_KEY=your_nasa_api_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
nasa_framework/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── package.json
│   └── env.example
├── package.json           # Root package.json
└── README.md
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build` - Build the React app for production
- `npm run install-all` - Install dependencies for all packages

### Backend (server/)
- `npm run dev` - Start server with nodemon (auto-restart on changes)
- `npm start` - Start server in production mode

### Frontend (client/)
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🌐 API Endpoints

The backend provides the following API endpoints:

- `GET /api/health` - Health check
- `GET /api/apod` - Astronomy Picture of the Day
- `GET /api/mars-rover` - Mars Rover Photos
- `GET /api/earth-imagery` - Earth Imagery
- `GET /api/neo` - Near Earth Objects
- `GET /api/epic` - EPIC Earth Images
- `POST /api/enhance-image` - ML-powered image enhancement (Super-Resolution, stub)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder to your hosting service

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the `server` folder
3. Update the frontend API proxy URL

### Environment Variables
```env
NASA_API_KEY=your_nasa_api_key_here
PORT=5000
NODE_ENV=production
```

## 📱 Features in Detail

### APOD (Astronomy Picture of the Day)
- Browse daily space imagery
- Date selection for historical images
- Download high-resolution versions
- Support for both images and videos

### Mars Rover Photos
- Multiple rover selection (Curiosity, Opportunity, Spirit, Perseverance)
- Camera-specific filtering
- Date and sol (Martian day) selection
- High-resolution image downloads

### Earth Imagery
- Coordinate-based location selection
- Date selection for historical imagery
- Cloud score information
- High-resolution satellite images

### Near Earth Objects
- Date range selection
- Hazardous asteroid identification
- Detailed orbital information
- Close approach data

### EPIC Earth Images
- Daily Earth imagery from DSCOVR satellite
- Multiple images per day
- Satellite position data
- Natural color imagery

### ML-Powered Space Image Enhancer
- Use Super-Resolution AI models (ESRGAN, stub for now) to enhance clarity of satellite or rover images
- Users can request HD-upscaled versions of images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NASA](https://www.nasa.gov/) for providing the amazing APIs
- [NASA API Documentation](https://api.nasa.gov/) for comprehensive API documentation
- The open-source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ and 🚀 for space exploration** 