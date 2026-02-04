# Urban Intelligence Platform

A comprehensive urban planning and city management platform built with modern web technologies for data-driven decision making.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Neon serverless)

### Development Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd UrbanIntelligencePlatform
npm install
```

2. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your database URL and other settings
```

3. **Set up database:**
```bash
npm run db:migrate
npm run db:seed
```

4. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:5000` to access the application.

## 🏗️ Production Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
```bash
# Build for production
npm run build

# Run migrations
npm run db:migrate

# Start production server
npm start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Features

- **Project Management**: Create and manage urban planning projects
- **Interactive Mapping**: SVG-based city maps with clickable districts
- **Traffic Simulation**: Real-time traffic flow visualization
- **Environmental Metrics**: Sustainability measurements and scoring
- **Land Use Planning**: Zoning data with geographic information
- **Real-time Activity**: Live updates and activity logging
- **Professional UI**: Modern interface with shadcn/ui components

## 🔧 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** + shadcn/ui
- **Wouter** for routing
- **React Hook Form** + Zod
- **TanStack Query** for state management
- **Recharts** for data visualization

### Backend
- **Node.js** + Express.js
- **TypeScript** with ESM modules
- **PostgreSQL** with Drizzle ORM
- **Neon** serverless database
- **Express sessions** with PostgreSQL storage
- **Helmet** for security headers
- **Rate limiting** with express-rate-limit

### Infrastructure
- **Docker** containerization
- **Health checks** and monitoring
- **Production logging** and error handling
- **Security middleware** and CORS
- **Database migrations** and seeding

## 📁 Project Structure

```
UrbanIntelligencePlatform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── middleware/        # Security & logging
│   ├── routes/           # API routes
│   ├── scripts/          # Database scripts
│   └── index.ts          # Server entry
├── shared/               # Shared TypeScript types
├── migrations/           # Database migrations
├── public/              # Static assets
└── dist/                # Build output
```

## 🔐 Security Features

- **Helmet.js** security headers
- **CORS** configuration
- **Rate limiting** (global and API-specific)
- **Input validation** with Zod
- **Session management** with secure cookies
- **Request validation** middleware
- **Error handling** without information leakage

## 📈 Monitoring

### Health Endpoints
- `/health` - Basic health check
- `/health/detailed` - System status with database
- `/ready` - Readiness probe
- `/live` - Liveness probe
- `/metrics` - Application metrics
- `/logs` - Recent application logs

### Features
- **Request logging** with response times
- **Error tracking** and reporting
- **Performance metrics** collection
- **Database connection** monitoring

## 🗄️ Database

### Schema
- **Users** - Authentication and profiles
- **Projects** - Urban planning projects
- **Land Use Zones** - Zoning data
- **Traffic Nodes** - Traffic simulation points
- **Environmental Metrics** - Sustainability data
- **Activity Logs** - Audit trail

### Management
```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed data
npm run db:seed

# Reset database
npm run db:reset

# Database studio
npm run db:studio
```

## 🚀 Scripts

```bash
# Development
npm run dev              # Start development server
npm run check            # TypeScript checking

# Building
npm run build            # Build client and server
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Production
npm start                # Start production server
npm run preview          # Build and preview

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Apply migrations
npm run db:seed          # Seed data
npm run db:reset         # Reset and seed
npm run db:studio        # Database GUI

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container

# Code quality
npm run lint             # ESLint check
npm run lint:fix         # Fix ESLint issues
```

## 🔧 Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db
NODE_ENV=development|production
SESSION_SECRET=your-secret-key

# Optional
PORT=5000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
TRUST_PROXY=false
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Review the health endpoints for system status
- Check application logs for troubleshooting

---

Built with ❤️ for urban planners and city administrators.
