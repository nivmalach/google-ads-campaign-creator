# Google Ads Campaign Creator - MVP

A web application for automating Google Ads campaign creation and management.

## Features

- 🔐 OAuth2 authentication with Google
- 🎯 Google Ads API integration
- 📊 Campaign management
- 🗄️ PostgreSQL database
- 🐳 Docker deployment

## Tech Stack

- **Backend**: Node.js, Express, TypeORM
- **Frontend**: React, Vite, TailwindCSS
- **Database**: PostgreSQL
- **APIs**: Google Ads API, Google OAuth2

## Prerequisites

- Docker & Docker Compose
- Google Ads Developer Token
- Google Cloud OAuth2 Credentials

## Setup

### 1. Get Google Ads Credentials

1. Create a Google Cloud Project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable the Google Ads API
3. Create OAuth2 credentials (Web application)
4. Get your Developer Token from [Google Ads API Center](https://ads.google.com/home/tools/manager-accounts/)

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `GOOGLE_ADS_CLIENT_ID`: Your OAuth2 Client ID
- `GOOGLE_ADS_CLIENT_SECRET`: Your OAuth2 Client Secret
- `GOOGLE_ADS_DEVELOPER_TOKEN`: Your Google Ads Developer Token
- `OAUTH_REDIRECT_URI`: Your OAuth2 redirect URI (e.g., `http://localhost:3000/api/auth/callback`)

### 3. Deploy with Docker

```bash
# Create the shared network (if not exists)
docker network create sharednet

# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
GET  /api/auth/url                  # Get OAuth2 authorization URL
GET  /api/auth/callback?code=xxx    # OAuth2 callback
POST /api/auth/validate             # Validate access token
POST /api/auth/list-accounts        # List Google Ads accounts
```

## Testing the Google Ads Connection

1. Visit `http://localhost:3000`
2. Click on "Connect Google Ads Account"
3. Authorize with your Google account
4. The app will fetch your Google Ads accounts to verify the connection

## Architecture

```
google-ads-campaign-creator/
├── backend/
│   └── dist/              # Compiled backend code
├── frontend/
│   └── dist/              # Built frontend assets
├── public/                # Served by backend (created by Docker)
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Production Deployment

### Environment Variables Required:
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `OAUTH_REDIRECT_URI`
- `DATABASE_URL` (or separate DB_* variables)
- `NODE_ENV=production`

### Deployment Steps:

1. Ensure all environment variables are set
2. Update `OAUTH_REDIRECT_URI` to your production domain
3. Build and deploy:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

## Database

The application uses PostgreSQL with TypeORM. The database schema is automatically synchronized on startup (in non-production environments).

### Entities:
- `Account`: Google Ads accounts
- `CampaignRule`: Campaign automation rules
- `Asset`: Creative assets
- `ExecutionHistory`: Automation execution logs

## Security Notes

- ⚠️ Change the default database password in `docker-compose.yml` before production
- 🔒 Never commit `.env` files
- 🔐 Use strong passwords for database
- 🌐 Configure CORS properly for production
- 🛡️ Review and update OAuth redirect URIs

## Troubleshooting

### Container won't start
```bash
docker-compose logs app
```

### Database connection issues
```bash
docker-compose logs db
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d
```

## License

ISC

