#!/bin/bash
# Deploy MVP Dashboard with Google Ads Integration
# Run this on your production server

set -e

echo "🚀 Deploying MVP Dashboard with Google Ads Integration..."

cd "$(dirname "$0")"

# Backup
if [ -f "frontend/dist/index.html" ]; then
    cp frontend/dist/index.html frontend/dist/index.html.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
fi

# Deploy MVP dashboard
cat > frontend/dist/index.html << 'MVPEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <base href="/gacc/">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Ads Campaign Creator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f7fafc;
            min-height: 100vh;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 { font-size: 24px; font-weight: 600; }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .card h2 {
            font-size: 20px;
            color: #2d3748;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn:hover { background: #5568d3; transform: translateY(-1px); }
        .btn:disabled {
            background: #cbd5e0;
            cursor: not-allowed;
            transform: none;
        }
        .account-list {
            display: grid;
            gap: 12px;
            margin-top: 20px;
        }
        .account-item {
            padding: 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .account-item:hover {
            border-color: #667eea;
            background: #f7fafc;
        }
        .account-item.selected {
            border-color: #667eea;
            background: #eef2ff;
        }
        .status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .status.connected { background: #d1fae5; color: #065f46; }
        .status.disconnected { background: #fee2e2; color: #991b1b; }
        .loading {
            text-align: center;
            padding: 40px;
            color: #718096;
        }
        .spinner {
            border: 3px solid #e2e8f0;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error {
            background: #fee2e2;
            color: #991b1b;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .success {
            background: #d1fae5;
            color: #065f46;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Google Ads Campaign Creator - MVP</h1>
    </div>
    
    <div class="container">
        <div class="card">
            <h2>
                🔐 Google Ads Connection
                <span id="connectionStatus" class="status disconnected">Disconnected</span>
            </h2>
            
            <div id="errorMessage"></div>
            <div id="successMessage"></div>
            
            <button id="connectBtn" class="btn">Connect Google Ads Account</button>
            
            <div id="accountsSection" style="display: none;">
                <h3 style="margin-top: 30px; font-size: 18px; color: #2d3748;">Your Google Ads Accounts</h3>
                <div id="accountsList" class="account-list"></div>
            </div>
            
            <div id="loadingSection" class="loading" style="display: none;">
                <div class="spinner"></div>
                <p>Loading your Google Ads accounts...</p>
            </div>
        </div>
        
        <div class="card">
            <h2>📊 System Info</h2>
            <p style="color: #718096; line-height: 1.8;">
                <strong>API Status:</strong> <span id="apiStatus">Checking...</span><br>
                <strong>Base Path:</strong> /gacc<br>
                <strong>Environment:</strong> Production<br>
                <strong>Health Check:</strong> <a href="/gacc/api/health" style="color: #667eea;">View</a>
            </p>
        </div>
    </div>

    <script>
        // Check API health on load
        fetch('/gacc/api/health')
            .then(r => r.json())
            .then(data => {
                document.getElementById('apiStatus').textContent = '✅ ' + data.status.toUpperCase();
                console.log('API Health:', data);
            })
            .catch(err => {
                document.getElementById('apiStatus').textContent = '❌ Error';
                console.error('Health check failed:', err);
            });

        // Connect button handler
        document.getElementById('connectBtn').addEventListener('click', async () => {
            try {
                const response = await fetch('/gacc/api/auth/url');
                const data = await response.json();
                
                if (data.authUrl) {
                    sessionStorage.setItem('authenticating', 'true');
                    window.location.href = data.authUrl;
                } else {
                    showError('Failed to get authorization URL');
                }
            } catch (error) {
                showError('Error connecting to API: ' + error.message);
            }
        });

        // Check if we just came back from OAuth
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            showError('Authentication failed: ' + error);
        } else if (code && sessionStorage.getItem('authenticating')) {
            sessionStorage.removeItem('authenticating');
            handleOAuthCallback(code);
        }

        async function handleOAuthCallback(code) {
            document.getElementById('loadingSection').style.display = 'block';
            document.getElementById('connectBtn').disabled = true;

            try {
                const response = await fetch(\`/gacc/api/auth/callback?code=\${code}\`);
                const data = await response.json();

                if (data.tokens && data.tokens.refresh_token) {
                    sessionStorage.setItem('refreshToken', data.tokens.refresh_token);
                    document.getElementById('connectionStatus').className = 'status connected';
                    document.getElementById('connectionStatus').textContent = 'Connected';
                    showSuccess('Successfully connected to Google Ads!');
                    await loadAccounts(data.tokens.refresh_token);
                } else {
                    showError('Authentication succeeded but no refresh token received.');
                }
            } catch (error) {
                showError('Error during authentication: ' + error.message);
            } finally {
                document.getElementById('loadingSection').style.display = 'none';
                document.getElementById('connectBtn').disabled = false;
            }
        }

        async function loadAccounts(refreshToken) {
            document.getElementById('loadingSection').style.display = 'block';
            
            try {
                const response = await fetch('/gacc/api/auth/list-accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                });

                const data = await response.json();

                if (data.accounts && data.accounts.length > 0) {
                    displayAccounts(data.accounts);
                    document.getElementById('accountsSection').style.display = 'block';
                } else {
                    showError('No Google Ads accounts found.');
                }
            } catch (error) {
                showError('Error loading accounts: ' + error.message);
            } finally {
                document.getElementById('loadingSection').style.display = 'none';
            }
        }

        function displayAccounts(accounts) {
            const accountsList = document.getElementById('accountsList');
            accountsList.innerHTML = accounts.map((accountId, index) => \`
                <div class="account-item" onclick="selectAccount('\${accountId}')">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="color: #2d3748;">Account \${index + 1}</strong>
                            <div style="color: #718096; font-size: 14px; margin-top: 4px;">
                                ID: \${accountId}
                            </div>
                        </div>
                        <span style="color: #667eea; font-size: 20px;">→</span>
                    </div>
                </div>
            \`).join('');
        }

        function selectAccount(accountId) {
            sessionStorage.setItem('selectedAccount', accountId);
            document.querySelectorAll('.account-item').forEach(item => {
                item.classList.remove('selected');
            });
            event.target.closest('.account-item').classList.add('selected');
            showSuccess(\`Selected account: \${accountId}\`);
            console.log('Selected account:', accountId);
        }

        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.innerHTML = \`<div class="error">❌ \${message}</div>\`;
            setTimeout(() => errorDiv.innerHTML = '', 10000);
        }

        function showSuccess(message) {
            const successDiv = document.getElementById('successMessage');
            successDiv.innerHTML = \`<div class="success">✅ \${message}</div>\`;
            setTimeout(() => successDiv.innerHTML = '', 5000);
        }

        const storedToken = sessionStorage.getItem('refreshToken');
        if (storedToken) {
            document.getElementById('connectionStatus').className = 'status connected';
            document.getElementById('connectionStatus').textContent = 'Connected';
            loadAccounts(storedToken);
        }
    </script>
</body>
</html>
MVPEOF

echo "✅ MVP Dashboard deployed"
echo ""
echo "📦 Restarting container..."
docker-compose restart app

echo ""
echo "⏳ Waiting for container to start..."
sleep 3

echo ""
echo "✅ Done! MVP Dashboard deployed successfully!"
echo ""
echo "🌐 Open https://opsotools.com/gacc in your browser"
echo ""
echo "Features available:"
echo "  ✓ Connect Google Ads account via OAuth2"
echo "  ✓ View all your Google Ads accounts"
echo "  ✓ Select an account to work with"
echo "  ✓ API health monitoring"

