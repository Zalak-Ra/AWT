"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const app = (0, express_1.default)();
// 1. Global Middleware
app.use((0, helmet_1.default)()); // Security Headers
app.use((0, cors_1.default)()); // Allow Cross-Origin Requests
app.use(express_1.default.json()); // Parse JSON bodies
// 2. Register Routes
app.use('/api/v1/payments', payment_routes_1.default);
// 3. Health Check (To see if server is alive)
app.get('/health', (_req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});
exports.default = app;
