#!/bin/bash

# Google Ads Campaign Creator - Deployment Script

set -e

echo "🚀 Google Ads Campaign Creator - MVP Deployment"
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your Google Ads credentials before continuing."
    echo "   Required variables:"
    echo "   - GOOGLE_ADS_CLIENT_ID"
    echo "   - GOOGLE_ADS_CLIENT_SECRET"
    echo "   - GOOGLE_ADS_DEVELOPER_TOKEN"
    echo "   - OAUTH_REDIRECT_URI"
    exit 1
fi

# Create network if it doesn't exist
echo "📡 Creating Docker network..."
docker network create sharednet 2>/dev/null || echo "Network already exists"

# Build the Docker image
echo "🏗️  Building Docker image..."
docker-compose build

# Start the services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
    echo "🌐 Application is available at: http://localhost:3000"
    echo "🏥 Health check: http://localhost:3000/api/health"
    echo ""
    echo "📝 View logs with: docker-compose logs -f"
    echo "🛑 Stop with: docker-compose down"
else
    echo "❌ Services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

