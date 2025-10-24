"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const googleAdsAuth_1 = require("./utils/googleAdsAuth");
dotenv_1.default.config();
const app = (0, express_1.default)();

// Configuration
const BASE_PATH = process.env.BASE_PATH || '';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';

// Middleware
const corsOptions = ALLOWED_ORIGINS === '*' 
    ? { origin: '*' }
    : { 
        origin: ALLOWED_ORIGINS.split(',').map(o => o.trim()),
        credentials: true 
    };
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());

// API Routes (with base path support)
app.use(`${BASE_PATH}/api/auth`, authRoutes_1.default);

// Health check endpoint (with and without base path for compatibility)
const healthCheck = (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        basePath: BASE_PATH || '/',
        publicUrl: process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`
    });
};
app.get('/api/health', healthCheck);
if (BASE_PATH) {
    app.get(`${BASE_PATH}/api/health`, healthCheck);
}

// Serve static files from the public directory (frontend build)
const publicPath = path_1.default.join(__dirname, '../../public');
if (BASE_PATH) {
    app.use(BASE_PATH, express_1.default.static(publicPath));
} else {
    app.use(express_1.default.static(publicPath));
}

// Catch-all routes to serve index.html for client-side routing
const serveIndex = (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
};

if (BASE_PATH) {
    // Exact base path (e.g., /gacc)
    app.get(BASE_PATH, serveIndex);
    // Base path with trailing slash (e.g., /gacc/)
    app.get(`${BASE_PATH}/`, serveIndex);
    // Any subpaths (e.g., /gacc/anything)
    app.get(`${BASE_PATH}/*`, serveIndex);
} else {
    // Root path
    app.get('*', serveIndex);
}

const PORT = process.env.PORT || 3000;

// Initialize Google Ads Auth
const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

if (clientId && clientSecret && developerToken) {
    googleAdsAuth_1.GoogleAdsAuth.initialize(clientId, clientSecret, developerToken);
    console.log('Google Ads API initialized');
} else {
    console.warn('Warning: Google Ads credentials not configured');
}

database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
})
    .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
});
