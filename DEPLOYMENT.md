# F1 Visualizer - Complete Deployment Guide

This guide covers everything needed to deploy the F1 Analytics platform to production.

## Pre-Deployment Checklist

- [ ] All code is committed to version control
- [ ] Environment variables configured for production
- [ ] Databases (PostgreSQL and MongoDB) set up and accessible
- [ ] SSL/TLS certificates obtained
- [ ] Domain name configured
- [ ] Frontend build tested locally
- [ ] API endpoints tested in production environment

## Frontend Deployment

### Build the Application

```bash
cd frontend
npm install
npm run build
```

This generates optimized files in `dist/` directory.

### Deployment Options

#### Option 1: Vercel (Recommended for quick deployment)

1. **Connect repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository

2. **Configure environment variables**
   - Add `VITE_API_URL` = `https://your-api-domain.com/api`

3. **Deploy**
   - Vercel automatically deploys on push to main branch

#### Option 2: Netlify

1. **Connect repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect Git repository

2. **Build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment variables**
   - Add `VITE_API_URL` = `https://your-api-domain.com/api`

#### Option 3: AWS S3 + CloudFront

1. **Build application**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution pointing to S3
   - Set index.html as default root object

4. **Update DNS**
   - Point domain CNAME to CloudFront distribution

#### Option 4: Self-hosted (Nginx)

1. **Build application**
   ```bash
   npm run build
   ```

2. **Transfer files to server**
   ```bash
   scp -r dist/* user@your-server:/var/www/f1-analytics/
   ```

3. **Configure Nginx**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     root /var/www/f1-analytics;

     location / {
       try_files $uri $uri/ /index.html;
     }

     location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

4. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Backend Deployment

### Build Configuration

The backend is a Node.js application. No build step is needed, but ensure dependencies are installed:

```bash
cd backend
npm install
```

### Deployment Options

#### Option 1: Heroku

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set PORT=5000
   heroku config:set DB_HOST=your-postgres-host
   heroku config:set DB_USER=postgres_user
   heroku config:set DB_PASSWORD=secure_password
   heroku config:set DB_NAME=f1_data
   heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/f1_analytics
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

#### Option 2: Railway

1. **Connect repository**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repository

2. **Add PostgreSQL and MongoDB services**
   - Click "Add Service"
   - Select PostgreSQL and MongoDB

3. **Configure environment variables**
   - Add all required variables in Railway dashboard

4. **Deploy**
   - Railway auto-deploys on push

#### Option 3: AWS EC2

1. **Launch EC2 instance**
   - Ubuntu 22.04 LTS recommended
   - At least t3.micro (1GB RAM)

2. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql postgresql-contrib mongodb
   ```

3. **Clone repository and setup**
   ```bash
   git clone your-repo
   cd backend
   npm install
   ```

4. **Create .env file**
   ```bash
   cat > .env << EOF
   PORT=5000
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=f1_data
   MONGODB_URI=mongodb://localhost:27017/f1_analytics
   EOF
   ```

5. **Initialize databases**
   ```bash
   npm run db:init
   npm run db:seed
   npm run db:views
   npm run mongo:seed
   ```

6. **Install PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start src/server.js --name f1-api
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx reverse proxy**
   ```nginx
   server {
     listen 80;
     server_name api.your-domain.com;

     location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

#### Option 4: DigitalOcean

1. **Create droplet**
   - Ubuntu 22.04
   - 2GB RAM minimum

2. **Follow AWS EC2 steps above** (mostly compatible)

3. **Enable UFW firewall**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

### Database Setup for Production

#### PostgreSQL on AWS RDS

1. **Create RDS instance**
   - Engine: PostgreSQL 14+
   - Multi-AZ enabled
   - Backup retention: 30 days

2. **Configure security group**
   - Allow inbound on port 5432 from your app

3. **Initialize database**
   ```bash
   psql -h your-rds-endpoint.aws.com -U admin -d postgres
   CREATE DATABASE f1_data;
   \q
   
   # Then run migrations
   npm run db:init
   npm run db:seed
   npm run db:views
   ```

#### MongoDB on MongoDB Atlas

1. **Create cluster**
   - Go to [mongodb.com/cloud](https://mongodb.com/cloud)
   - Create free or paid cluster

2. **Create database user**
   - Set username and password

3. **Get connection string**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/f1_analytics
   ```

4. **Add to environment variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/f1_analytics
   ```

## SSL/HTTPS Configuration

### Let's Encrypt (Free)

#### Nginx
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Standalone
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

### Redirect HTTP to HTTPS

```nginx
server {
  listen 80;
  server_name your-domain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  server_name your-domain.com;
  ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
  # ... rest of config
}
```

## Monitoring & Maintenance

### Health Checks

```bash
# Frontend
curl https://your-domain.com

# Backend
curl https://api.your-domain.com/api/health
```

### Log Monitoring

```bash
# PM2 logs
pm2 logs

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

### Database Backups

#### PostgreSQL
```bash
# Daily backup script
0 2 * * * pg_dump -h localhost -U postgres f1_data | gzip > /backups/f1_data_$(date +\%Y\%m\%d).sql.gz
```

#### MongoDB
```bash
# Daily backup script
0 2 * * * mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net" --out /backups/mongo_$(date +\%Y\%m\%d)
```

## Scaling Considerations

### Frontend
- CDN with global distribution (CloudFlare, AWS CloudFront)
- Caching headers optimized
- Image optimization

### Backend
- Connection pooling
- Database indexing
- Load balancing with multiple instances
- Cache layer (Redis) for frequently accessed data

## Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use secrets management service

2. **CORS Configuration**
   - Whitelist only trusted domains
   - Review CORS headers

3. **Database Security**
   - Strong passwords (20+ chars, mixed case, numbers, symbols)
   - Restrict IP access
   - Enable encryption in transit

4. **API Security**
   - Rate limiting on endpoints
   - Input validation
   - SQL injection prevention (already handled by ORMs)

5. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Performance monitoring (New Relic, DataDog)
   - Uptime monitoring (UptimeRobot)

## Troubleshooting

### API Connection Issues
- Verify frontend VITE_API_URL is correct
- Check CORS configuration in backend
- Ensure backend is running and accessible

### Database Connection Errors
- Verify connection strings
- Check firewall rules
- Confirm database is running
- Validate credentials

### Performance Issues
- Check database query performance
- Enable caching
- Optimize images
- Review server resources

## Cost Estimation (Monthly)

- Frontend hosting (Vercel): Free - $20
- Backend hosting (Heroku): $7 - $50
- PostgreSQL (AWS RDS): $15 - $100+
- MongoDB (Atlas): Free - $57+
- Domain: $12
- CDN: $0 - $100+

**Total**: $34 - $300+ depending on traffic

## Support Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [MongoDB Manual](https://docs.mongodb.com/manual)

## Next Steps

1. Choose hosting provider
2. Set up databases
3. Configure domains
4. Deploy frontend
5. Deploy backend
6. Test all functionality
7. Set up monitoring
8. Configure backups
9. Document deployment procedures
10. Plan for scaling
