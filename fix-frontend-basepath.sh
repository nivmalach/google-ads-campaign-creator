#!/bin/bash
# Fix frontend asset paths for /gacc base path
# Run this on your production server

set -e

echo "🔧 Fixing frontend asset paths for /gacc base path..."

cd "$(dirname "$0")"

if [ ! -f "frontend/dist/index.html" ]; then
    echo "❌ Error: frontend/dist/index.html not found"
    exit 1
fi

# Backup
cp frontend/dist/index.html frontend/dist/index.html.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

# Update the HTML file
cat > frontend/dist/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <base href="/gacc/" />
    <link rel="icon" type="image/svg+xml" href="/gacc/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google Ads Campaign Creator</title>
    <script type="module" crossorigin src="/gacc/assets/index-6c790e6c.js"></script>
    <link rel="stylesheet" href="/gacc/assets/index-c76ed2e8.css">
  </head>
  <body>
    <div id="root"></div>
    
  </body>
</html>
EOF

echo "✅ File updated"
echo ""
echo "📦 Restarting container..."
docker-compose restart app

echo ""
echo "⏳ Waiting for container to start..."
sleep 3

echo ""
echo "✅ Done! Your frontend should now load at https://opsotools.com/gacc"
echo "🌐 Open https://opsotools.com/gacc in your browser"

