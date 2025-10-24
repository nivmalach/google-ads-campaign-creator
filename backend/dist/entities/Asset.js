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
exports.Asset = void 0;
const typeorm_1 = require("typeorm");
const CampaignRule_1 = require("./CampaignRule");
let Asset = class Asset {
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Asset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CampaignRule_1.CampaignRule, rule => rule.assets),
    __metadata("design:type", CampaignRule_1.CampaignRule)
], Asset.prototype, "campaignRule", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "asset_type" }),
    __metadata("design:type", String)
], Asset.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "file_path" }),
    __metadata("design:type", String)
], Asset.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "dimensions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "original_filename" }),
    __metadata("design:type", String)
], Asset.prototype, "originalFilename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "mime_type" }),
    __metadata("design:type", String)
], Asset.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "file_size" }),
    __metadata("design:type", Number)
], Asset.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Asset.prototype, "createdAt", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)("assets")
], Asset);
