# Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Platform Deployments](#cloud-platform-deployments)
5. [Static Hosting](#static-hosting)
6. [Environment Configuration](#environment-configuration)
7. [SSL/TLS Setup](#ssltls-setup)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying Labyrinth Nexus to various environments. The application is containerized with Docker for easy deployment.

### Deployment Options

| Platform | Difficulty | Cost | Best For |
|----------|-----------|------|----------|
| Docker | Easy | $ | Self-hosted, full control |
| AWS (ECS/EC2) | Medium | $$ | Scalability, AWS ecosystem |
| Azure (App Service) | Easy | $$ | Enterprise, Microsoft stack |
| Google Cloud Run | Easy | $ | Serverless, auto-scaling |
| Netlify/Vercel | Easy | $ | Static hosting, simple apps |
| Railway | Easy | $$ | Quick deployment, dev-friendly |

---

## Pre-Deployment Checklist

### Security

- [ ] All secrets removed from code
- [ ] Environment variables configured
- [ ] HTTPS/SSL certificate obtained
- [ ] CORS properly configured
- [ ] Security headers enabled (CSP, XSS, etc.)
- [ ] API rate limiting configured (backend)
- [ ] Authentication properly secured

### Performance

- [ ] Production build tested (`npm run build:prod`)
- [ ] Bundle size within budget (< 1MB)
- [ ] Assets optimized (images, fonts)
- [ ] Gzip compression enabled
- [ ] Caching headers configured

### Functionality

- [ ] All features tested
- [ ] Error handling verified
- [ ] API integration tested
- [ ] Authentication flow tested
- [ ] Mobile responsiveness checked

### Documentation

- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment process documented
- [ ] Rollback procedure defined

---

## Docker Deployment

### Option 1: Docker Compose (Recommended for Simple Deployments)

**1. Create `.env` file:**
```bash
# .env
API_URL=https://api.yourdomain.com
APP_NAME=My Application
SESSION_TIMEOUT=1800000
INACTIVITY_TIMEOUT=1800000
REFRESH_BEFORE_EXPIRY=120000
```

**2. Update `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

**3. Deploy:**
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 2: Docker with Custom Network

```bash
# Create network
docker network create labyrinth-network

# Run container
docker run -d \
  --name labyrinth-nexus \
  --network labyrinth-network \
  -p 80:80 \
  -e API_URL=https://api.yourdomain.com \
  -e APP_NAME="My App" \
  --restart unless-stopped \
  labyrinth-nexus:latest

# Check status
docker ps
docker logs labyrinth-nexus

# Stop
docker stop labyrinth-nexus
docker rm labyrinth-nexus
```

### Docker Best Practices

**Use Multi-Stage Builds** (Already configured):
```dockerfile
# Build stage - heavy
FROM node:20-alpine AS build
# ... build steps

# Production stage - lightweight
FROM nginx:alpine
# ... copy artifacts
```

**Health Checks** (Already configured):
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
```

**Security:**
- Don't run as root (add to Dockerfile):
  ```dockerfile
  RUN addgroup -g 1001 -S nginx && \
      adduser -u 1001 -S nginx -G nginx
  USER nginx
  ```

---

## Cloud Platform Deployments

### AWS Elastic Container Service (ECS)

**1. Build and push image to ECR:**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag labyrinth-nexus:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/labyrinth-nexus:latest

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/labyrinth-nexus:latest
```

**2. Create ECS Task Definition:**
```json
{
  "family": "labyrinth-nexus",
  "containerDefinitions": [
    {
      "name": "labyrinth-nexus",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/labyrinth-nexus:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "API_URL",
          "value": "https://api.yourdomain.com"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --quiet --tries=1 --spider http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 3,
        "retries": 3
      }
    }
  ]
}
```

**3. Create ECS Service:**
```bash
aws ecs create-service \
  --cluster my-cluster \
  --service-name labyrinth-nexus \
  --task-definition labyrinth-nexus:1 \
  --desired-count 2 \
  --launch-type FARGATE
```

### Google Cloud Run

**1. Build and push to Google Container Registry:**
```bash
# Configure docker for GCR
gcloud auth configure-docker

# Build
docker build -t gcr.io/PROJECT_ID/labyrinth-nexus:latest .

# Push
docker push gcr.io/PROJECT_ID/labyrinth-nexus:latest
```

**2. Deploy to Cloud Run:**
```bash
gcloud run deploy labyrinth-nexus \
  --image gcr.io/PROJECT_ID/labyrinth-nexus:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars API_URL=https://api.yourdomain.com \
  --allow-unauthenticated \
  --port 80
```

**3. Update environment variables:**
```bash
gcloud run services update labyrinth-nexus \
  --set-env-vars API_URL=https://new-api.com \
  --region us-central1
```

### Azure Container Instances

**1. Login to Azure Container Registry:**
```bash
az acr login --name myregistry
```

**2. Build and push:**
```bash
docker tag labyrinth-nexus:latest myregistry.azurecr.io/labyrinth-nexus:latest
docker push myregistry.azurecr.io/labyrinth-nexus:latest
```

**3. Deploy:**
```bash
az container create \
  --resource-group myResourceGroup \
  --name labyrinth-nexus \
  --image myregistry.azurecr.io/labyrinth-nexus:latest \
  --dns-name-label labyrinth-nexus \
  --ports 80 \
  --environment-variables \
    API_URL='https://api.yourdomain.com' \
    APP_NAME='My App'
```

### Railway

**1. Install Railway CLI:**
```bash
npm install -g @railway/cli
```

**2. Login and initialize:**
```bash
railway login
railway init
```

**3. Deploy:**
```bash
railway up
```

**4. Set environment variables:**
```bash
railway variables set API_URL=https://api.yourdomain.com
```

---

## Static Hosting

For static hosting (Netlify, Vercel), you need to build the app first and configure a separate API.

### Netlify

**1. Build the app:**
```bash
npm run build:prod
```

**2. Create `netlify.toml`:**
```toml
[build]
  publish = "dist/labyrinth-nexus/browser"
  command = "npm run build:prod"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

**3. Deploy:**
```bash
# Using Netlify CLI
npm install -g netlify-cli
netlify deploy --prod

# Or connect GitHub repo in Netlify dashboard
```

**4. Configure environment:**
- Go to Site settings → Environment variables
- Add: `API_URL`, `APP_NAME`, etc.
- Rebuild site

### Vercel

**1. Create `vercel.json`:**
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist/labyrinth-nexus/browser",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": { "cache-control": "public, max-age=31536000, immutable" },
      "continue": true
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**2. Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**3. Configure environment:**
```bash
vercel env add API_URL production
vercel env add APP_NAME production
```

---

## Environment Configuration

### Production Environment Variables

Create production-specific configuration:

**Option 1: Docker Environment Variables**
```bash
docker run -d \
  -e API_URL=https://api.production.com \
  -e APP_NAME="Production App" \
  -e SESSION_TIMEOUT=3600000 \
  labyrinth-nexus:latest
```

**Option 2: Config File Replacement**
```bash
# During deployment, replace app-config.json
cat > dist/labyrinth-nexus/browser/assets/config/app-config.json <<EOF
{
  "apiUrl": "https://api.production.com",
  "appName": "Production App",
  "sessionTimeout": 3600000,
  "inactivityTimeout": 3600000,
  "refreshBeforeExpiry": 300000
}
EOF
```

**Option 3: Build-Time Environment Variables**

Update `environment.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.yourdomain.com'
};
```

---

## SSL/TLS Setup

### Using Nginx (Already configured in nginx.conf)

**1. Obtain SSL Certificate:**

**Option A: Let's Encrypt (Free)**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

**Option B: Manual Certificate**
```bash
# Copy certificate files
cp your-cert.crt /etc/nginx/ssl/
cp your-key.key /etc/nginx/ssl/
```

**2. Update nginx.conf:**
```nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /etc/nginx/ssl/your-cert.crt;
  ssl_certificate_key /etc/nginx/ssl/your-key.key;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # ... rest of config
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}
```

### Using Cloud Providers

**AWS (ALB):**
- Configure SSL certificate in AWS Certificate Manager (ACM)
- Attach to Application Load Balancer
- ALB handles SSL termination

**Google Cloud:**
- Managed SSL certificates automatic with Cloud Run
- Custom domains configure in Cloud Run settings

**Cloudflare:**
- Add domain to Cloudflare
- Enable Universal SSL (automatic)
- Set SSL mode to "Full" or "Full (strict)"

---

## Monitoring & Logging

### Application Logs

**Docker logs:**
```bash
# View logs
docker logs labyrinth-nexus

# Follow logs
docker logs -f labyrinth-nexus

# Last 100 lines
docker logs --tail 100 labyrinth-nexus
```

### Health Monitoring

**Health check endpoint:**
```bash
curl http://yourdomain.com/health
# Should return: healthy
```

**Docker health check:**
```bash
docker inspect labyrinth-nexus | grep -A 5 Health
```

### External Monitoring Services

**1. Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- StatusCake

**2. Error Tracking:**
- Sentry
- Rollbar
- Bugsnag

**3. Performance Monitoring:**
- Google Analytics
- Datadog
- New Relic

### Setting up Sentry

**1. Install Sentry:**
```bash
npm install @sentry/angular
```

**2. Configure (app.config.ts):**
```typescript
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  tracesSampleRate: 1.0
});

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler()
    }
  ]
};
```

---

## Troubleshooting

### Common Issues

**1. App shows blank page:**

**Cause:** Base href or routing issues

**Solution:**
```bash
# Check browser console for errors
# Verify base href in index.html
<base href="/">

# Check nginx config for proper redirects
location / {
  try_files $uri $uri/ /index.html;
}
```

---

**2. API calls failing:**

**Cause:** CORS, wrong API URL, or network issues

**Solution:**
```bash
# Check API URL in config
cat /path/to/assets/config/app-config.json

# Verify CORS on backend
# Check browser network tab for errors
```

---

**3. Docker container unhealthy:**

**Cause:** Health check failing

**Solution:**
```bash
# Check health endpoint
docker exec labyrinth-nexus wget -q -O- http://localhost/health

# Check nginx status
docker exec labyrinth-nexus nginx -t

# View nginx logs
docker exec labyrinth-nexus cat /var/log/nginx/error.log
```

---

**4. High memory usage:**

**Cause:** Memory leak or large bundle

**Solution:**
```bash
# Limit Docker memory
docker run -d -m 512m labyrinth-nexus:latest

# Analyze bundle size
npm run build:stats
npx webpack-bundle-analyzer dist/labyrinth-nexus/browser/stats.json
```

---

**5. Slow loading:**

**Cause:** Large bundle, no caching, or network latency

**Solution:**
- Enable gzip compression (already in nginx.conf)
- Check bundle size (< 500KB initial)
- Verify CDN/caching headers
- Use lazy loading for routes

---

### Rollback Procedure

**Docker:**
```bash
# Tag previous version
docker tag labyrinth-nexus:v1.0.0 labyrinth-nexus:latest

# Restart container
docker-compose down
docker-compose up -d
```

**Cloud Platforms:**
```bash
# AWS ECS
aws ecs update-service --service labyrinth-nexus --task-definition labyrinth-nexus:previous-version

# Google Cloud Run
gcloud run services update-traffic labyrinth-nexus --to-revisions=previous-revision=100

# Kubernetes
kubectl rollout undo deployment/labyrinth-nexus
```

---

## Performance Optimization

### CDN Setup

**Cloudflare:**
1. Add domain to Cloudflare
2. Enable Auto Minify (JS, CSS, HTML)
3. Enable Rocket Loader
4. Set Browser Cache TTL

**AWS CloudFront:**
```bash
# Create distribution
aws cloudfront create-distribution \
  --origin-domain-name yourdomain.com \
  --default-cache-behavior MinTTL=0,DefaultTTL=86400
```

### Caching Strategy

**Already configured in nginx.conf:**
- Static assets: 1 year cache
- index.html: No cache
- API responses: Handled by backend

---

## Security Best Practices

### Production Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Environment variables used for secrets
- [ ] CSP policy configured
- [ ] Rate limiting enabled (backend)
- [ ] Regular security updates
- [ ] Monitoring and alerts configured

### Regular Maintenance

**Weekly:**
- Check logs for errors
- Monitor uptime
- Review security alerts

**Monthly:**
- Update dependencies (`npm update`)
- Review and rotate secrets
- Security audit (`npm audit`)
- Performance review

**Quarterly:**
- Major version updates
- Security penetration testing
- Disaster recovery drill

---

*Last updated: 2025-01-08*
