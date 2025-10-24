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
exports.ExecutionHistory = void 0;
const typeorm_1 = require("typeorm");
const CampaignRule_1 = require("./CampaignRule");
let ExecutionHistory = class ExecutionHistory {
};
exports.ExecutionHistory = ExecutionHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExecutionHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CampaignRule_1.CampaignRule, rule => rule.executionHistory),
    __metadata("design:type", CampaignRule_1.CampaignRule)
], ExecutionHistory.prototype, "campaignRule", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExecutionHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "campaign_id", nullable: true }),
    __metadata("design:type", String)
], ExecutionHistory.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "error_message", type: "text", nullable: true }),
    __metadata("design:type", String)
], ExecutionHistory.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ExecutionHistory.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "executed_at" }),
    __metadata("design:type", Date)
], ExecutionHistory.prototype, "executedAt", void 0);
exports.ExecutionHistory = ExecutionHistory = __decorate([
    (0, typeorm_1.Entity)("execution_history")
], ExecutionHistory);
