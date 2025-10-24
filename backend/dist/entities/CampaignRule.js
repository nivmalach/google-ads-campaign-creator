"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRule = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Asset_1 = require("./Asset");
const ExecutionHistory_1 = require("./ExecutionHistory");
let CampaignRule = class CampaignRule {
};
exports.CampaignRule = CampaignRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CampaignRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, account => account.campaignRules),
    __metadata("design:type", Account_1.Account)
], CampaignRule.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "campaign_type", default: "DISPLAY" }),
    __metadata("design:type", String)
], CampaignRule.prototype, "campaignType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "budget_amount", type: "decimal" }),
    __metadata("design:type", Number)
], CampaignRule.prototype, "budgetAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "budget_currency", length: 3 }),
    __metadata("design:type", String)
], CampaignRule.prototype, "budgetCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "bidding_strategy" }),
    __metadata("design:type", String)
], CampaignRule.prototype, "biddingStrategy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "bid_amount", type: "decimal", nullable: true }),
    __metadata("design:type", Number)
], CampaignRule.prototype, "bidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], CampaignRule.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CampaignRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], CampaignRule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Asset_1.Asset, asset => asset.campaignRule),
    __metadata("design:type", Array)
], CampaignRule.prototype, "assets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ExecutionHistory_1.ExecutionHistory, history => history.campaignRule),
    __metadata("design:type", Array)
], CampaignRule.prototype, "executionHistory", void 0);
exports.CampaignRule = CampaignRule = __decorate([
    (0, typeorm_1.Entity)("campaign_rules")
], CampaignRule);
