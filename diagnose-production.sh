#!/bin/bash

# Google Ads Campaign Creator - Production Diagnostics
# Run this script on your production server to diagnose 502 errors

echo "🔍 Google Ads Campaign Creator - Production Diagnostics"
echo "=========================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Not in project directory. Please cd to google-ads-campaign-creator first."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Check if .env file exists
echo "1️⃣  Checking environment file..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    echo "   📝 Environment variables set:"
    grep -E "^[A-Z_]+=.+" .env | cut -d'=' -f1 | sed 's/^/      - /'
else
    echo "   ❌ .env file missing!"
    echo "   👉 Create .env file with your credentials"
fi
echo ""

# Check Docker daemon
echo "2️⃣  Checking Docker..."
if docker ps > /dev/null 2>&1; then
    echo "   ✅ Docker is running"
else
    echo "   ❌ Docker is not running or you don't have permission"
    echo "   👉 Try: sudo systemctl start docker"
    exit 1
fi
echo ""

# Check if containers are running
echo "3️⃣  Checking containers..."
RUNNING=$(docker-compose ps --services --filter "status=running" 2>/dev/null)
if [ -n "$RUNNING" ]; then
    echo "   ✅ Running containers:"
    echo "$RUNNING" | sed 's/^/      - /'
else
    echo "   ❌ No containers running!"
    echo "   👉 Try: docker-compose up -d"
fi

ALL=$(docker-compose ps --services 2>/dev/null)
STOPPED=$(comm -23 <(echo "$ALL" | sort) <(echo "$RUNNING" | sort))
if [ -n "$STOPPED" ]; then
    echo "   ⚠️  Stopped containers:"
    echo "$STOPPED" | sed 's/^/      - /'
fi
echo ""

# Check app container specifically
echo "4️⃣  Checking app container..."
if docker ps | grep -q "google-ads-campaign-creator"; then
    echo "   ✅ App container is running"
    CONTAINER_ID=$(docker ps | grep "google-ads-campaign-creator" | awk '{print $1}')
    echo "   📊 Container ID: $CONTAINER_ID"
    
    # Check container health
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_ID 2>/dev/null)
    if [ -n "$HEALTH" ]; then
        if [ "$HEALTH" = "healthy" ]; then
            echo "   ✅ Container health: $HEALTH"
        else
            echo "   ⚠️  Container health: $HEALTH"
        fi
    fi
else
    echo "   ❌ App container not running!"
    echo "   👉 Try: docker-compose up -d app"
fi
echo ""

# Check database container
echo "5️⃣  Checking database container..."
if docker ps | grep -q "google-ads-campaign-creator-db"; then
    echo "   ✅ Database container is running"
else
    echo "   ❌ Database container not running!"
    echo "   👉 Try: docker-compose up -d db"
fi
echo ""

# Check networks
echo "6️⃣  Checking networks..."
if docker network ls | grep -q "sharednet"; then
    echo "   ✅ sharednet network exists"
    
    # Check if app is on the network
    if docker network inspect sharednet 2>/dev/null | grep -q "google-ads-campaign-creator"; then
        echo "   ✅ App is connected to sharednet"
    else
        echo "   ⚠️  App not connected to sharednet"
        echo "   👉 Try: docker network connect sharednet google-ads-campaign-creator"
    fi
else
    echo "   ❌ sharednet network doesn't exist!"
    echo "   👉 Try: docker network create sharednet"
fi
echo ""

# Test local connectivity
echo "7️⃣  Testing local connectivity..."
if curl -s --max-time 5 http://localhost:3000/gacc/api/health > /dev/null 2>&1; then
    echo "   ✅ App responds on http://localhost:3000/gacc/api/health"
    HEALTH_DATA=$(curl -s http://localhost:3000/gacc/api/health)
    echo "   📊 Health check response:"
    echo "$HEALTH_DATA" | python3 -m json.tool 2>/dev/null | sed 's/^/      /' || echo "$HEALTH_DATA" | sed 's/^/      /'
elif curl -s --max-time 5 http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "   ⚠️  App responds on http://localhost:3000/api/health (without base path)"
    echo "   🔍 BASE_PATH might not be set correctly"
else
    echo "   ❌ App doesn't respond on port 3000"
    echo "   👉 Check container logs: docker-compose logs app"
fi
echo ""

# Check recent logs for errors
echo "8️⃣  Checking recent logs for errors..."
ERROR_COUNT=$(docker-compose logs --tail=100 app 2>/dev/null | grep -i "error\|exception\|fatal" | wc -l)
if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "   ⚠️  Found $ERROR_COUNT error(s) in recent logs"
    echo "   📝 Last 5 errors:"
    docker-compose logs --tail=100 app 2>/dev/null | grep -i "error\|exception\|fatal" | tail -5 | sed 's/^/      /'
    echo ""
    echo "   👉 View full logs: docker-compose logs app"
else
    echo "   ✅ No errors in recent logs"
fi
echo ""

# Summary
echo "=========================================================="
echo "📋 Summary & Next Steps"
echo "=========================================================="
echo ""

# Determine status
APP_RUNNING=$(docker ps | grep -q "google-ads-campaign-creator" && echo "yes" || echo "no")
DB_RUNNING=$(docker ps | grep -q "google-ads-campaign-creator-db" && echo "yes" || echo "no")
NETWORK_OK=$(docker network ls | grep -q "sharednet" && echo "yes" || echo "no")
LOCAL_OK=$(curl -s --max-time 5 http://localhost:3000/gacc/api/health > /dev/null 2>&1 && echo "yes" || echo "no")

if [ "$APP_RUNNING" = "yes" ] && [ "$DB_RUNNING" = "yes" ] && [ "$LOCAL_OK" = "yes" ]; then
    echo "✅ All systems operational!"
    echo ""
    echo "🌐 Your app should be accessible at:"
    echo "   https://opsotools.com/gacc"
    echo ""
    echo "If you still see 502 error, check your reverse proxy configuration:"
    echo "   - nginx: /etc/nginx/sites-enabled/"
    echo "   - Caddy: /etc/caddy/Caddyfile"
    echo ""
    echo "Make sure it proxies to: http://localhost:3000/gacc/"
elif [ "$APP_RUNNING" = "no" ]; then
    echo "❌ App container not running"
    echo ""
    echo "👉 To start the app:"
    echo "   docker-compose up -d"
    echo ""
    echo "👉 To rebuild and start:"
    echo "   docker-compose down"
    echo "   docker-compose build"
    echo "   docker-compose up -d"
elif [ "$LOCAL_OK" = "no" ]; then
    echo "⚠️  App container is running but not responding"
    echo ""
    echo "👉 Check logs for errors:"
    echo "   docker-compose logs -f app"
    echo ""
    echo "👉 Check if environment variables are set:"
    echo "   docker-compose config | grep -A 20 environment"
else
    echo "⚠️  Some issues detected"
    echo ""
    echo "👉 Review the diagnostics above and fix any ❌ items"
fi

echo ""
echo "=========================================================="

