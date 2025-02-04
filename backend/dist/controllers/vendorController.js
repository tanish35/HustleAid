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
exports.addApprovedVendor = exports.getVendorById = exports.getVendors = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const ethers_1 = require("ethers");
const abi_1 = require("../lib/abi");
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const RPC_URL = process.env.RPC_URL;
exports.getVendors = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield prisma_1.default.vendor.findMany();
    res.json(vendors);
}));
exports.getVendorById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            walletAddress,
        },
    });
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
}));
exports.addApprovedVendor = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, name, email, phone, description } = req.body;
    const vendor = yield prisma_1.default.vendor.create({
        data: {
            walletAddress,
            name,
            email,
            phone,
            description,
        },
    });
    const provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers_1.ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, abi_1.abi, signer);
    const tx = yield contract.addApprovedVendor(walletAddress);
    yield tx.wait();
    res.json({ vendor, transactionHash: tx.hash });
}));
