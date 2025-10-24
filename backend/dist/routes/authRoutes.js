"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// OAuth2 routes
router.get('/url', authController_1.AuthController.getAuthUrl);
router.get('/callback', authController_1.AuthController.handleCallback);
router.post('/validate', authController_1.AuthController.validateToken);
// Google Ads routes
router.post('/list-accounts', authController_1.AuthController.listAccounts);
exports.default = router;
