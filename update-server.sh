#!/bin/bash
# Script to update server.js on production
# This fixes the "Cannot GET /" issue for BASE_PATH routes

cat > /tmp/server.js.patch << 'EOF'
--- a/backend/dist/server.js
+++ b/backend/dist/server.js
@@ -44,10 +44,24 @@ app.get('/api/health', healthCheck);
 if (BASE_PATH) {
     app.get(`${BASE_PATH}/api/health`, healthCheck);
 }
+
 // Serve static files from the public directory (frontend build)
 const publicPath = path_1.default.join(__dirname, '../../public');
 if (BASE_PATH) {
     app.use(BASE_PATH, express_1.default.static(publicPath));
 } else {
     app.use(express_1.default.static(publicPath));
 }
-// Catch-all route to serve index.html for client-side routing
-app.get(`${BASE_PATH}/*`, (req, res) => {
-    res.sendFile(path_1.default.join(publicPath, 'index.html'));
-});
+
+// Catch-all routes to serve index.html for client-side routing
+const serveIndex = (req, res) => {
+    res.sendFile(path_1.default.join(publicPath, 'index.html'));
+};
+
+if (BASE_PATH) {
+    // Exact base path (e.g., /gacc)
+    app.get(BASE_PATH, serveIndex);
+    // Base path with trailing slash (e.g., /gacc/)
+    app.get(`${BASE_PATH}/`, serveIndex);
+    // Any subpaths (e.g., /gacc/anything)
+    app.get(`${BASE_PATH}/*`, serveIndex);
+} else {
+    // Root path
+    app.get('*', serveIndex);
+}
EOF

echo "Patch file created. Apply it on production with:"
echo "cd /path/to/google-ads-campaign-creator"
echo "patch -p1 < /tmp/server.js.patch"

