"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/payments/payment.routes.ts
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
const controller = new payment_controller_1.PaymentController();
// Map the Endpoint to the Controller Function
// POST /api/v1/payments/intents
router.post('/intents', controller.createIntent);
exports.default = router;
