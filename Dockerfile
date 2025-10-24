# Use Node.js LTS version
FROM node:20-alpine

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev || npm install --production

# Copy backend compiled code
COPY backend/dist ./backend/dist
COPY backend/package.json ./backend/

# Copy frontend built files to public directory (served by backend)
COPY frontend/dist ./public

# Fix frontend asset paths for BASE_PATH deployment
# This runs during Docker build, so you never have to patch manually
RUN sed -i 's|href="/vite.svg"|href="/gacc/vite.svg"|g' ./public/index.html && \
    sed -i 's|src="/assets/|src="/gacc/assets/|g' ./public/index.html && \
    sed -i 's|href="/assets/|href="/gacc/assets/|g' ./public/index.html && \
    sed -i 's|<meta charset="UTF-8" />|<meta charset="UTF-8" />\n    <base href="/gacc/" />|' ./public/index.html && \
    sed -i 's|<title>frontend</title>|<title>Google Ads Campaign Creator</title>|' ./public/index.html

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["npm", "start"]
