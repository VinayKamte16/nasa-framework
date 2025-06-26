# 🚀 Deployment Guide

This guide will help you deploy the NASA Framework to various hosting platforms.

## Prerequisites

- NASA API key (get one at [https://api.nasa.gov/](https://api.nasa.gov/))
- Git repository set up
- Node.js knowledge

## 🎯 Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend (Vercel)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set build settings:
     - Framework Preset: Create React App
     - Build Command: `cd client && npm install && npm run build`
     - Output Directory: `client/build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

#### Backend (Railway)
1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set the root directory to `server`
   - Add environment variables:
     ```
     NASA_API_KEY=your_nasa_api_key_here
     NODE_ENV=production
     ```

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend (Netlify)
1. **Build locally**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `client/build` folder to Netlify
   - Or connect your GitHub repository
   - Set build command: `cd client && npm install && npm run build`
   - Set publish directory: `client/build`

#### Backend (Heroku)
1. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   heroku config:set NASA_API_KEY=your_nasa_api_key_here
   heroku config:set NODE_ENV=production
   git subtree push --prefix server heroku main
   ```

### Option 3: Full Stack on Railway

1. **Deploy both frontend and backend**
   - Go to [railway.app](https://railway.app)
   - Create two services from the same repository
   - Frontend service:
     - Root directory: `client`
     - Build command: `npm install && npm run build`
     - Start command: `npm start`
   - Backend service:
     - Root directory: `server`
     - Start command: `npm start`
   - Add environment variables to backend service

## 🔧 Environment Variables

### Backend (.env)
```env
NASA_API_KEY=your_nasa_api_key_here
PORT=5000
NODE_ENV=production
```

### Frontend
Update the API URL in your deployment platform:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## 📝 Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify image downloads work
- [ ] Check responsive design on mobile
- [ ] Test all NASA API integrations
- [ ] Update CORS settings if needed
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend domain
   - Update the `origin` in server/index.js

2. **API Key Issues**
   - Verify NASA API key is correctly set
   - Check API key permissions and rate limits

3. **Build Failures**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

4. **Image Loading Issues**
   - Verify NASA API endpoints are accessible
   - Check network connectivity

### Debug Commands

```bash
# Check backend logs
heroku logs --tail
railway logs

# Test API locally
curl http://localhost:5000/api/health

# Check environment variables
heroku config
railway variables
```

## 🔒 Security Considerations

- Never commit API keys to version control
- Use environment variables for sensitive data
- Enable HTTPS in production
- Set up proper CORS policies
- Consider rate limiting for API endpoints

## 📊 Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize image loading
- Consider lazy loading for large datasets

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Open an issue on GitHub
4. Contact platform support

---

**Happy Deploying! 🚀** 