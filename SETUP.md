# Quick Setup Guide - MVP Deployment

## Prerequisites
- Docker & Docker Compose installed
- Google Ads API credentials

## Step 1: Get Google Ads Credentials

### A. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google Ads API"

### B. Create OAuth2 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback`
5. Save the **Client ID** and **Client Secret**

### C. Get Developer Token
1. Go to [Google Ads](https://ads.google.com)
2. Navigate to Tools > API Center
3. Apply for and get your **Developer Token**
   - Note: You'll need test access for MVP

## Step 2: Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your credentials
nano .env  # or use any text editor
```

Required values in `.env`:
```
GOOGLE_ADS_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your-client-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Step 3: Deploy

### Option A: Use deployment script (Recommended)
```bash
./deploy.sh
```

### Option B: Manual deployment
```bash
# Create network
docker network create sharednet

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

## Step 4: Test the Connection

1. Open browser: `http://localhost:3000`
2. Check health: `http://localhost:3000/api/health`
3. Test OAuth flow:
   - Visit `http://localhost:3000/api/auth/url` to get auth URL
   - Authorize with your Google account
   - You'll be redirected back with tokens

## Verify API Connection

Use curl or Postman to test:

```bash
# Health check
curl http://localhost:3000/api/health

# Get OAuth URL
curl http://localhost:3000/api/auth/url

# List accounts (after getting refresh_token from OAuth)
curl -X POST http://localhost:3000/api/auth/list-accounts \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your-refresh-token"}'
```

## Troubleshooting

### Docker not running
```bash
# macOS: Open Docker Desktop
# Linux: sudo systemctl start docker
```

### Connection refused
```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs app
docker-compose logs db
```

### Database issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

### OAuth redirect issues
Make sure `OAUTH_REDIRECT_URI` in `.env` matches exactly what you set in Google Cloud Console.

## Production Deployment

For production (e.g., on a VPS):

1. Update `.env`:
   - Set `NODE_ENV=production`
   - Update `OAUTH_REDIRECT_URI` to your domain
   - Change database password in `docker-compose.yml`

2. Add your production domain to Google Cloud Console OAuth settings

3. Deploy:
   ```bash
   docker-compose up -d
   ```

4. Set up SSL with nginx/Caddy reverse proxy (recommended)

## Next Steps

Once the MVP is verified:
- [ ] Set up proper domain with SSL
- [ ] Configure production OAuth credentials
- [ ] Apply for Google Ads API production access
- [ ] Implement campaign creation features
- [ ] Add monitoring and logging

