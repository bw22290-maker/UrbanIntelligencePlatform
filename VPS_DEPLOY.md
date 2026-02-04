# VPS Production Deployment

## Deploy to Your Own Server

### Prerequisites
- Ubuntu 20.04+ or CentOS 8+
- Docker and Docker Compose installed
- Domain name (optional)

### Quick Deploy

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd UrbanIntelligencePlatform
```

#### 2. Configure Environment
```bash
cp .env.production .env
# Edit .env with your production values
```

#### 3. Deploy with Docker Compose
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### 4. Setup SSL with Let's Encrypt
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### Production Docker Compose
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  app:
    image: urbanintelligenceplatform_app:latest
    restart: always
    environment:
      - NODE_ENV=production
    env_file:
      - .env

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: urbanintelligence
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - app

volumes:
  postgres_data:
```

### Monitoring
- Check logs: `docker-compose logs -f`
- Health check: `curl https://yourdomain.com/health`
- Backup database: `docker-compose exec db pg_dump`

### Security
- Firewall enabled (only ports 80, 443)
- Regular updates: `apt update && apt upgrade`
- Monitor logs for suspicious activity
