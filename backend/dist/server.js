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
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());

// API Routes
app.use("/api/auth", authRoutes_1.default);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve static files from the public directory (frontend build)
const publicPath = path_1.default.join(__dirname, '../../public');
app.use(express_1.default.static(publicPath));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});

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
