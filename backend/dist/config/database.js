"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("../entities/Account");
const CampaignRule_1 = require("../entities/CampaignRule");
const Asset_1 = require("../entities/Asset");
const ExecutionHistory_1 = require("../entities/ExecutionHistory");

// Parse DATABASE_URL if provided (format: postgres://user:password@host:port/database)
let dbConfig = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "google_ads_automation",
};

if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
        type: "postgres",
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading slash
    };
}

exports.AppDataSource = new typeorm_1.DataSource({
    ...dbConfig,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development",
    entities: [Account_1.Account, CampaignRule_1.CampaignRule, Asset_1.Asset, ExecutionHistory_1.ExecutionHistory],
    migrations: [],
    subscribers: [],
});
