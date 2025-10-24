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
exports.Account = void 0;
const typeorm_1 = require("typeorm");
const CampaignRule_1 = require("./CampaignRule");
let Account = class Account {
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "mcc_id" }),
    __metadata("design:type", String)
], Account.prototype, "mccId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "account_id" }),
    __metadata("design:type", String)
], Account.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "account_name" }),
    __metadata("design:type", String)
], Account.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Account.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CampaignRule_1.CampaignRule, rule => rule.account),
    __metadata("design:type", Array)
], Account.prototype, "campaignRules", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)("accounts")
], Account);
