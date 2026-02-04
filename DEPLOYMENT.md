# Production Deployment Guide

## Overview

This guide covers deploying the Urban Intelligence Platform to production environments.

## Prerequisites

- Node.js 20+ 
- PostgreSQL 15+ (or Neon serverless)
- Docker & Docker Compose (for containerized deployment)
- SSL certificate (for HTTPS)

## Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env.production
```

2. Configure production environment variables:
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Environment
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Security
SESSION_SECRET=your-super-secure-secret-key
CORS_ORIGINS=https://yourdomain.com
TRUST_PROXY=true
```

## Database Setup

### Option 1: Neon Serverless (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create new database
3. Copy connection string to `.env.production`

### Option 2: Self-hosted PostgreSQL
```bash
# Create database
createdb urban_intelligence

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

1. Build and start services:
```bash
docker-compose up -d
```

2. Initialize database:
```bash
docker-compose exec app npm run db:migrate
docker-compose exec app npm run db:seed
```

3. Check health:
```bash
curl http://localhost:5000/health
```

### Option 2: Manual Deployment

1. Install dependencies:
```bash
npm ci --only=production
```

2. Build application:
```bash
npm run build
```

3. Run database migrations:
```bash
npm run db:migrate
```

4. Seed initial data:
```bash
npm run db:seed
```

5. Start application:
```bash
npm start
```

### Option 3: Cloud Platform Deployment

#### Vercel/Netlify (Frontend only)
```bash
# Build client only
npm run build:client

# Deploy dist/public directory
```

#### Railway/Render (Full-stack)
1. Connect repository
2. Set environment variables
3. Deploy automatically

#### AWS ECS/DigitalOcean App Platform
1. Build Docker image:
```bash
docker build -t urban-intelligence-platform .
```

2. Push to container registry
3. Deploy to platform

## SSL/HTTPS Setup

### Option 1: Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 2: Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Health Checks

### Health Endpoints
- `/health` - Basic health check
- `/health/detailed` - Detailed system status
- `/ready` - Readiness probe
- `/live` - Liveness probe
- `/metrics` - Application metrics
- `/logs` - Recent logs

### Monitoring Setup
1. Set up uptime monitoring (Pingdom, UptimeRobot)
2. Configure log aggregation (ELK stack, Papertrail)
3. Set up alerting for health check failures

## Performance Optimization

### Database
- Enable connection pooling
- Add indexes for frequently queried fields
- Monitor slow queries

### Application
- Enable gzip compression
- Configure CDN for static assets
- Monitor memory usage

### Caching
- Redis for session storage
- Application-level caching
- CDN caching headers

## Security Checklist

- [ ] Environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured

## Backup Strategy

### Database Backups
```bash
# Daily backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Application Backups
- Backup source code
- Backup configuration files
- Document deployment process

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL
   - Verify database is running
   - Check network connectivity

2. **High Memory Usage**
   - Monitor with `/metrics` endpoint
   - Check for memory leaks
   - Consider increasing resources

3. **Slow Response Times**
   - Check database performance
   - Monitor CPU usage
   - Review application logs

### Log Analysis
```bash
# View recent logs
curl http://localhost:5000/logs?limit=100

# View error logs
curl http://localhost:5000/logs?level=error
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer
- Share session storage (Redis)
- Database read replicas

### Vertical Scaling
- Increase CPU/memory
- Optimize database queries
- Implement caching

## Maintenance

### Regular Tasks
- Update dependencies
- Review security advisories
- Monitor performance metrics
- Test backup/restore procedures

### Updates
1. Test in staging environment
2. Backup production data
3. Deploy with zero downtime
4. Verify functionality
5. Monitor post-deployment
