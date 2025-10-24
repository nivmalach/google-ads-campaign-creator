# MVP Deployment Checklist ✅

## Pre-Deployment

### 1. Google Ads Setup
- [ ] Create Google Cloud Project
- [ ] Enable Google Ads API
- [ ] Create OAuth2 credentials (Web Application)
- [ ] Get Developer Token from Google Ads API Center
- [ ] Add test Google Ads account (for testing)

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `GOOGLE_ADS_CLIENT_ID`
- [ ] Fill in `GOOGLE_ADS_CLIENT_SECRET`
- [ ] Fill in `GOOGLE_ADS_DEVELOPER_TOKEN`
- [ ] Set correct `OAUTH_REDIRECT_URI`
- [ ] Change database password in `docker-compose.yml` (production)

### 3. System Requirements
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Port 3000 available
- [ ] Sufficient disk space (min 2GB)

## Deployment Steps

### Local/Test Deployment
```bash
# 1. Create network
docker network create sharednet

# 2. Deploy
./deploy.sh

# OR manually:
docker-compose build
docker-compose up -d
```

### Verification Tests
- [ ] `curl http://localhost:3000/api/health` returns 200 OK
- [ ] Visit `http://localhost:3000` - frontend loads
- [ ] `curl http://localhost:3000/api/auth/url` returns auth URL
- [ ] OAuth flow completes successfully
- [ ] Can list Google Ads accounts after OAuth

## Testing Google Ads Connection

### Step 1: Get OAuth URL
```bash
curl http://localhost:3000/api/auth/url
```
Copy the `authUrl` from response

### Step 2: Authorize
- Open the URL in browser
- Login with Google account
- Grant permissions
- Copy the `code` from callback URL

### Step 3: Exchange Code for Tokens
```bash
curl "http://localhost:3000/api/auth/callback?code=YOUR_CODE_HERE"
```
Save the `refresh_token` from response

### Step 4: List Google Ads Accounts
```bash
curl -X POST http://localhost:3000/api/auth/list-accounts \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

If this returns your Google Ads accounts, **the API connection is verified!** ✅

## Production Deployment

### Additional Steps for Production
- [ ] Set up domain name
- [ ] Configure SSL certificate
- [ ] Set up reverse proxy (nginx/Caddy)
- [ ] Update `OAUTH_REDIRECT_URI` to production domain
- [ ] Add production domain to Google OAuth settings
- [ ] Change all default passwords
- [ ] Set `NODE_ENV=production`
- [ ] Set up monitoring (e.g., UptimeRobot)
- [ ] Set up log aggregation
- [ ] Configure backups for PostgreSQL
- [ ] Apply for Google Ads API production access (if needed)

### Security Checklist
- [ ] Database password changed from default
- [ ] `.env` file not committed to git
- [ ] CORS configured for production domain only
- [ ] Rate limiting implemented (future)
- [ ] Input validation in place
- [ ] HTTPS only (via reverse proxy)

## Monitoring

### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Container status
docker-compose ps

# View logs
docker-compose logs -f app
docker-compose logs -f db
```

### Common Issues

1. **Container won't start**
   ```bash
   docker-compose logs app
   # Check DATABASE_URL and Google credentials
   ```

2. **Database connection failed**
   ```bash
   docker-compose logs db
   # Verify postgres container is running
   ```

3. **OAuth redirect mismatch**
   - Verify `OAUTH_REDIRECT_URI` matches Google Console setting exactly

4. **Google Ads API errors**
   - Check Developer Token is valid
   - Verify test account has access
   - Check API is enabled in Google Cloud

## Rollback Plan

If deployment fails:
```bash
# Stop containers
docker-compose down

# Remove volumes (if needed)
docker-compose down -v

# Previous version (if using git tags)
git checkout previous-tag
docker-compose up -d
```

## Success Criteria

✅ MVP is ready when:
- Health endpoint returns 200
- Frontend loads without errors
- OAuth flow completes
- Can fetch Google Ads accounts via API
- No critical errors in logs

## Post-Deployment

- [ ] Document any production-specific configuration
- [ ] Share credentials securely with team
- [ ] Set up monitoring alerts
- [ ] Schedule regular backups
- [ ] Plan next features

---

**Last Updated:** 2025-10-24
**Status:** Ready for MVP deployment

