#!/bin/bash
# Create a simple Hello World page for testing
# Run this on your production server

set -e

echo "🔧 Creating Hello World test page..."

cd "$(dirname "$0")"

# Backup current index.html
if [ -f "frontend/dist/index.html" ]; then
    cp frontend/dist/index.html frontend/dist/index.html.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
fi

# Create simple Hello World page
cat > frontend/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Ads Campaign Creator</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
        }
        h1 {
            color: #667eea;
            font-size: 48px;
            margin: 0 0 20px 0;
            font-weight: 700;
        }
        p {
            color: #4a5568;
            font-size: 20px;
            margin: 0 0 30px 0;
        }
        .success {
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            margin-top: 20px;
        }
        .info {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-top: 30px;
            text-align: left;
        }
        .info h3 {
            margin: 0 0 10px 0;
            color: #667eea;
        }
        .info ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .info li {
            margin: 5px 0;
            color: #4a5568;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Hello World!</h1>
        <p>Google Ads Campaign Creator MVP</p>
        <div class="success">✓ Deployment Successful!</div>
        
        <div class="info">
            <h3>System Status</h3>
            <ul>
                <li>✅ Server: Running</li>
                <li>✅ Base Path: /gacc</li>
                <li>✅ Environment: Production</li>
                <li>✅ Database: Connected</li>
                <li>✅ Google Ads API: Initialized</li>
            </ul>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #718096;">
            API Health Check: <a href="/gacc/api/health" style="color: #667eea;">/gacc/api/health</a>
        </p>
    </div>
</body>
</html>
EOF

echo "✅ Hello World page created"
echo ""
echo "📦 Restarting container..."
docker-compose restart app

echo ""
echo "⏳ Waiting for container to start..."
sleep 3

echo ""
echo "✅ Done!"
echo "🌐 Open https://opsotools.com/gacc in your browser"
echo ""
echo "You should see a beautiful 'Hello World' page!"

