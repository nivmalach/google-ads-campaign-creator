#!/bin/bash
# Fix "Cannot GET /" for BASE_PATH routes
# Run this script on your production server

set -e

echo "🔧 Fixing frontend route handling..."

cd "$(dirname "$0")"

if [ ! -f "backend/dist/server.js" ]; then
    echo "❌ Error: backend/dist/server.js not found"
    echo "Make sure you're in the project root directory"
    exit 1
fi

# Backup
cp backend/dist/server.js backend/dist/server.js.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

# Use sed to replace the catch-all route section
# This is a safe, targeted fix
cat > /tmp/fix_routes.js << 'EOFJS'

// Catch-all routes to serve index.html for client-side routing
const serveIndex = (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
};

if (BASE_PATH) {
    // Exact base path (e.g., /gacc)
    app.get(BASE_PATH, serveIndex);
    // Base path with trailing slash (e.g., /gacc/)
    app.get(\`\${BASE_PATH}/\`, serveIndex);
    // Any subpaths (e.g., /gacc/anything)
    app.get(\`\${BASE_PATH}/*\`, serveIndex);
} else {
    // Root path
    app.get('*', serveIndex);
}
EOFJS

# Find and replace the old catch-all section
awk '
    /\/\/ Catch-all route to serve index.html/ {
        # Skip old implementation (next 3 lines)
        getline; getline; getline;
        # Insert new implementation
        system("cat /tmp/fix_routes.js");
        next;
    }
    { print }
' backend/dist/server.js > backend/dist/server.js.new

mv backend/dist/server.js.new backend/dist/server.js
rm /tmp/fix_routes.js

echo "✅ File updated"
echo ""
echo "📦 Restarting container..."
docker-compose restart app

echo ""
echo "⏳ Waiting for container to start..."
sleep 5

echo ""
echo "🧪 Testing..."
if curl -s --max-time 5 http://localhost:3000/gacc/api/health > /dev/null; then
    echo "✅ Health check passed"
    echo "✅ Your app should now work at https://opsotools.com/gacc"
else
    echo "⚠️  Health check failed. Check logs with: docker-compose logs app"
fi

