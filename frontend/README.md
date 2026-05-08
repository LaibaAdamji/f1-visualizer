# F1 Analytics - Formula 1 Statistics & Analytics Platform

A modern, high-performance web application for viewing and analyzing Formula 1 data with real-time statistics, driver standings, team information, and race results.

## Features

- **Dashboard**: Real-time F1 statistics and performance analytics
- **Driver Profiles**: Comprehensive driver information with performance metrics
- **Team Information**: Constructor data with championship history
- **Race Calendar**: Complete race schedule with results
- **Standings**: Live championship standings with filtering options
- **Modern UI**: Cutting-edge design with smooth animations and glassmorphic components
- **Responsive Design**: Fully responsive across all devices
- **Gradient Cursor Trail**: Interactive cursor effects for enhanced user experience

## Tech Stack

**Frontend:**
- React 19.2
- Vite (build tool)
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- React Router (navigation)

**Backend:**
- Node.js + Express
- PostgreSQL (primary database)
- MongoDB (analytics database)
- Sequelize (ORM)
- Mongoose (MongoDB ODM)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL instance
- MongoDB instance (optional, for hybrid features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd f1-visualizer
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Update .env.local with your API URL
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env .env  # Ensure .env is configured
   ```

### Configuration

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=f1_data

MONGODB_URI=mongodb://localhost:27017/f1_analytics
```

### Development

**Start the backend:**
```bash
cd backend
npm run dev
```

**Start the frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Database Setup

**Initialize PostgreSQL:**
```bash
cd backend
npm run db:init
npm run db:seed
npm run db:views
```

**Initialize MongoDB (optional):**
```bash
npm run mongo:seed
```

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Backend Production
```bash
cd backend
npm start
```

## Deployment

### Environment Variables for Production

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-api-domain.com/api
```

**Backend (.env):**
```env
PORT=5000
NODE_ENV=production
DB_HOST=prod-db-host
DB_PORT=5432
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=f1_data_prod
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/f1_analytics
```

### Deployment Steps

1. **Frontend**: Deploy the `dist/` folder to your static hosting (Vercel, Netlify, AWS S3, etc.)
2. **Backend**: Deploy the backend application to a Node.js hosting platform (Heroku, AWS EC2, Railway, etc.)
3. **Databases**: Set up PostgreSQL and MongoDB instances in production
4. **Update API URL**: Configure the frontend's VITE_API_URL to point to your production backend

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:init` - Initialize database
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed with sample data
- `npm run mongo:seed` - Seed MongoDB
- `npm run db:views` - Create database views

## API Documentation

### Endpoints

**Drivers**
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/stats/:driverId` - Get driver statistics
- `GET /api/drivers/standings/:seasonId` - Get driver standings for a season

**Races**
- `GET /api/races` - Get all races
- `GET /api/races/results/:raceId` - Get race results
- `GET /api/races/circuit/:circuitId` - Get races by circuit

**Teams**
- `GET /api/teams` - Get all teams
- `GET /api/teams/:teamId/drivers/:seasonId` - Get team drivers
- `GET /api/teams/stats/:teamId` - Get team statistics

**Views**
- `GET /api/views/driver-performance` - Driver performance data
- `GET /api/views/team-standings` - Team standings
- `GET /api/views/race-winners` - Recent race winners
- `GET /api/views/current-lineups` - Current driver lineups
- `GET /api/views/circuit-stats` - Circuit statistics

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading of routes and components
- Image optimization
- Minified CSS and JavaScript in production
- Efficient chart rendering with Recharts
- Database query optimization with views
- Caching strategies implemented

## Known Issues & Limitations

- MongoDB connection is optional for the main features
- Some hybrid features require both databases to be operational

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@f1analytics.app or open an issue in the repository.

## Credits

- Formula 1 data sourced from official F1 API
- UI design inspired by modern sports analytics platforms
- Built with React and modern web technologies
