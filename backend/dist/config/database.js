"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("../entities/Account");
const CampaignRule_1 = require("../entities/CampaignRule");
const Asset_1 = require("../entities/Asset");
const ExecutionHistory_1 = require("../entities/ExecutionHistory");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "google_ads_automation",
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [Account_1.Account, CampaignRule_1.CampaignRule, Asset_1.Asset, ExecutionHistory_1.ExecutionHistory],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
