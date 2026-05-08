# Deployment Configuration Files

This directory contains ready-to-use configuration files for deploying F1 Analytics to various platforms.

## Quick Deploy Configs

### Vercel (Frontend) - vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api_url"
  },
  "envPrefix": "VITE_"
}
```

### Heroku (Backend) - Procfile

```
web: npm start
release: npm run db:init && npm run db:views
```

### Docker (Both)

**Dockerfile.backend:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/src ./src
EXPOSE 5000
CMD ["node", "src/server.js"]
```

**Dockerfile.frontend:**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: f1_data
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  mongodb:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: f1_data
      MONGODB_URI: mongodb://mongodb:27017/f1_analytics
    depends_on:
      - postgres
      - mongodb

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://backend:5000/api

volumes:
  postgres_data:
  mongo_data:
```

### PM2 (Self-hosted) - ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'f1-api',
      script: './backend/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

### Nginx Reverse Proxy - nginx.conf

```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name your-domain.com;

    root /var/www/f1-analytics;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Environment Setup Examples

### AWS EC2 - setup.sh

```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2

# Clone repository
git clone <your-repo> /opt/f1-analytics
cd /opt/f1-analytics

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:init
npm run db:seed
npm run db:views

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Setup frontend
cd ../frontend
npm install
npm run build

# Copy to web root
sudo cp -r dist/* /var/www/f1-analytics/

echo "Setup complete!"
```

### Railway.app - railway.json

```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "on_failure"
  }
}
```

### GitHub Actions - .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build

      - name: Build Backend
        run: |
          cd backend
          npm install

      - name: Deploy to Vercel (Frontend)
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

      - name: Deploy to Heroku (Backend)
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "./backend"
```

## Database Configuration

### PostgreSQL with Backups - backup.sh

```bash
#!/bin/bash

BACKUP_DIR="/backups/f1_analytics"
DB_NAME="f1_data"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
mkdir -p $BACKUP_DIR
pg_dump $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/backup_$DATE.sql.gz"
```

Add to crontab:
```
0 2 * * * /home/ubuntu/backup.sh
```

## Monitoring

### Uptime Monitoring - monitor.js

```javascript
const axios = require('axios');

const endpoints = [
  'http://localhost:5000/api/health',
  'http://localhost:5174'
];

setInterval(async () => {
  for (const url of endpoints) {
    try {
      await axios.get(url, { timeout: 5000 });
      console.log(`✅ ${url} is up`);
    } catch (error) {
      console.error(`❌ ${url} is down:`, error.message);
      // Send alert/notification
    }
  }
}, 60000); // Check every minute
```

## SSL/TLS Configuration

### Let's Encrypt Auto-Renewal

```bash
#!/bin/bash

# Initial cert
sudo certbot certonly --standalone -d your-domain.com

# Auto-renew (runs daily)
sudo certbot renew --quiet

# Nginx config for SSL
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Your location blocks here
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Usage

Select the configuration files matching your deployment platform and customize the environment variables to match your setup.

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.
