# Production Environment Variables Guide

This guide explains all environment variables for deploying to production at a subpath.

## Required Environment Variables

### Server Configuration
```bash
PORT=3000                    # Port the application listens on
NODE_ENV=production          # Set to production for optimizations
```

### Deployment Configuration
```bash
BASE_PATH=/gacc                              # Subpath where app is deployed (e.g., /gacc for opstools.com/gacc)
PUBLIC_URL=https://opstools.com/gacc         # Full public URL where app is accessible
ALLOWED_ORIGINS=https://opstools.com         # Comma-separated list of allowed CORS origins
```

### Security
```bash
SESSION_SECRET=your-secure-random-secret     # Use a strong random secret (min 32 characters)
```

### Google Ads API
```bash
GOOGLE_ADS_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-token
OAUTH_REDIRECT_URI=https://opstools.com/gacc/api/auth/callback  # Must match BASE_PATH + /api/auth/callback
```

### Database
```bash
DATABASE_URL=postgres://user:password@host:port/database
```

## Example Production Configuration

For deployment at `https://opstools.com/gacc`:

```env
# Server
PORT=3000
NODE_ENV=production

# Deployment
BASE_PATH=/gacc
PUBLIC_URL=https://opstools.com/gacc
ALLOWED_ORIGINS=https://opstools.com

# Security
SESSION_SECRET=opso_8x4K9m2P#yL$nQ7zJ3wY5hR9tF

# Google Ads API
GOOGLE_ADS_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-token
OAUTH_REDIRECT_URI=https://opstools.com/gacc/api/auth/callback

# Database
DATABASE_URL=postgres://google-ads-campaign-creator:NM3103LLK6@db:5432/google-ads-campaign-creator
```

## Important Notes

### 1. BASE_PATH Configuration
- **Must start with `/`** (e.g., `/gacc` not `gacc`)
- **No trailing slash** (e.g., `/gacc` not `/gacc/`)
- If deploying at root, leave empty or omit entirely

### 2. OAUTH_REDIRECT_URI
- Must match exactly what you configured in Google Cloud Console
- Must include the BASE_PATH: `{PUBLIC_URL}/api/auth/callback`
- Example: `https://opstools.com/gacc/api/auth/callback`

### 3. ALLOWED_ORIGINS
- For multiple origins, separate with commas: `https://app1.com,https://app2.com`
- Should match your domain without the base path
- Use `*` only for development/testing

### 4. SESSION_SECRET
- Generate a strong random secret
- Example: `openssl rand -base64 32`
- Never commit this to git

## Google Cloud Console Setup

When deploying at a subpath, update your OAuth2 settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add Authorized Redirect URI:
   ```
   https://opstools.com/gacc/api/auth/callback
   ```

## Health Check Endpoints

The application provides health check endpoints at:
- `https://opstools.com/gacc/api/health` (with base path)
- `https://opstools.com/api/health` (without base path - for reverse proxy compatibility)

## Testing After Deployment

```bash
# Health check
curl https://opstools.com/gacc/api/health

# Should return:
# {
#   "status": "ok",
#   "timestamp": "...",
#   "environment": "production",
#   "basePath": "/gacc",
#   "publicUrl": "https://opstools.com/gacc"
# }

# Get OAuth URL
curl https://opstools.com/gacc/api/auth/url
```

## Reverse Proxy Configuration

If you're using nginx or similar, make sure to:

1. **Preserve the base path**:
   ```nginx
   location /gacc/ {
       proxy_pass http://app:3000/gacc/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

2. **Pass environment variables** to the container

## Troubleshooting

### Issue: OAuth redirect mismatch
- Verify `OAUTH_REDIRECT_URI` matches Google Console exactly
- Check that BASE_PATH is included in the redirect URI

### Issue: CORS errors
- Ensure `ALLOWED_ORIGINS` includes your domain
- Don't include the base path in ALLOWED_ORIGINS

### Issue: 404 on subpath
- Verify BASE_PATH starts with `/` and has no trailing slash
- Check reverse proxy is forwarding requests correctly

### Issue: Static files not loading
- Ensure PUBLIC_URL is set correctly
- May need to configure frontend build to use BASE_PATH as base URL

