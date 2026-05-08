# F1 Analytics - Quick Start Guide

Get the F1 Analytics platform up and running in minutes!

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (or use existing instance)
- MongoDB (optional, for enhanced features)

### Step 1: Clone & Install

```bash
git clone <your-repository-url>
cd f1-visualizer
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=f1_data
MONGODB_URI=mongodb://localhost:27017/f1_analytics
```

Initialize database:
```bash
npm run db:init
npm run db:seed
npm run db:views
```

Start backend:
```bash
npm run dev
# Backend runs on http://localhost:5000
```

### Step 3: Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
```

Create `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
# Frontend runs on http://localhost:5174
```

### Step 4: Access the Application

Open your browser and go to:
```
http://localhost:5174
```

That's it! 🎉

---

## 📊 What You Can Do

Once running, the application provides:

- **Dashboard**: Real-time F1 statistics
- **Drivers Page**: Browse all drivers with performance metrics
- **Teams Page**: View team information and standings
- **Races Page**: Full race calendar with results
- **Standings Page**: Live championship standings with filtering

---

## 🛠️ Common Tasks

### Initialize Database from Scratch

```bash
cd backend
npm run db:reset    # Reset database
npm run db:seed     # Seed with sample data
npm run db:views    # Create optimized views
```

### Add MongoDB (Optional)

1. Start MongoDB:
```bash
# macOS
brew services start mongodb-community

# Windows (if installed via chocolatey)
net start MongoDB

# Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

2. Seed MongoDB:
```bash
cd backend
npm run mongo:seed
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/ folder
```

**Backend:**
No build needed - just ensure dependencies are installed.

### Run Tests (when available)

```bash
npm test
```

---

## 🔍 Troubleshooting

### "Port already in use"

```bash
# On macOS/Linux
lsof -i :5000
kill -9 <PID>

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Cannot connect to database"

1. Ensure PostgreSQL is running
2. Verify credentials in `.env`
3. Check database exists: `psql -l`

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend shows "API is unavailable"

1. Ensure backend is running: `curl http://localhost:5000/api/health`
2. Check VITE_API_URL in `.env.local`
3. Check browser console for errors

---

## 📁 Project Structure

```
f1-visualizer/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── pages/        # Dashboard, Drivers, Teams, etc.
│   │   ├── components/   # Reusable UI components
│   │   ├── services/     # API integration
│   │   └── assets/       # Images, logos
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # Express.js + Node.js API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database models
│   │   ├── config/       # Database setup
│   │   └── scripts/      # Database utilities
│   ├── package.json
│   └── .env
│
├── README.md             # Project overview
├── DEPLOYMENT.md         # Deployment guide
└── API_DOCUMENTATION.md  # API reference
```

---

## 🌐 Environment Variables

### Frontend (.env.local)
```env
# API endpoint
VITE_API_URL=http://localhost:5000/api

# Optional: analytics tracking
VITE_SENTRY_DSN=
```

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=f1_data

# MongoDB (optional)
MONGODB_URI=mongodb://localhost:27017/f1_analytics
```

---

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Backend README](./backend/README.md) - Backend details
- [Frontend README](./frontend/README.md) - Frontend details

---

## 🚀 Next Steps

1. **Customize styling**: Edit `frontend/tailwind.config.js`
2. **Add new pages**: Create in `frontend/src/pages/`
3. **Extend API**: Add endpoints in `backend/src/routes/`
4. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 💡 Tips & Tricks

### Hot Reload Development

Both frontend and backend support hot module reloading:
- Frontend: Changes auto-reload in browser
- Backend: Uses nodemon for auto-restart

### Database Backups

```bash
# Backup PostgreSQL
pg_dump f1_data > backup.sql

# Restore PostgreSQL
psql f1_data < backup.sql

# Backup MongoDB
mongodump --db f1_analytics
```

### Performance Debugging

Frontend:
```bash
npm run build  # Check bundle size
```

Backend:
```bash
npm run dev    # See detailed logs
```

### Clean Up

```bash
# Remove all node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build artifacts
rm -rf dist/
```

---

## 📞 Support

- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review [Troubleshooting](#-troubleshooting)
- Check application logs in terminal
- Open an issue on GitHub

---

## 🎯 Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser to `http://localhost:5174`
4. Make changes - they hot-reload automatically
5. Test your changes
6. Commit and push

---

## 📊 API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "F1 Visualizer API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎨 Customization Examples

### Change Primary Color

Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  f1: {
    red: '#YOUR_COLOR', // Change this
    // ...
  }
}
```

### Add New Chart

Edit `frontend/src/pages/Dashboard.jsx`:
```javascript
// Add your chart component using recharts
<BarChart data={yourData}>
  {/* Your chart config */}
</BarChart>
```

### Add API Endpoint

Create route in `backend/src/routes/`:
```javascript
router.get('/your-endpoint', (req, res) => {
  // Your logic
  res.json({ data: result });
});
```

---

## 🔐 Security Notes

- Never commit `.env` files with sensitive data
- Use strong database passwords
- Enable HTTPS in production
- Implement rate limiting on API endpoints
- Validate all user inputs

---

Enjoy using F1 Analytics! 🏎️
