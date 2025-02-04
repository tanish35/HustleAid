"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBankDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const BANK_API_URL = process.env.BANK_API_URL;
const SECRET_KEY = process.env.JWT_SECRET || "secret";
const TOKEN_EXPIRY = "2m";
function generateJWT() {
    return jsonwebtoken_1.default.sign({ authorized: true }, SECRET_KEY, {
        expiresIn: TOKEN_EXPIRY,
    });
}
exports.getBankDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const panNo = req.params.panNo;
    if (!panNo) {
        res.status(400).json({ error: "PAN No. is required" });
        return;
    }
    const token = generateJWT();
    try {
        const response = yield axios_1.default.get(`${BANK_API_URL}/${panNo}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        res.json("data fetched");
    }
    catch (error) {
        console.error("Error fetching bank details:", error);
        res.status(500).json({ error: "Failed to fetch bank details" });
    }
}));
