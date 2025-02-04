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
exports.existsKey = exports.incrementKey = exports.getJSON = exports.setJSON = exports.deleteKey = exports.getKey = exports.setKey = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
const setKey = (key, value, expiry) => __awaiter(void 0, void 0, void 0, function* () {
    if (expiry) {
        yield redis.set(key, value, "EX", expiry);
    }
    else {
        yield redis.set(key, value);
    }
});
exports.setKey = setKey;
const getKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis.get(key);
});
exports.getKey = getKey;
const deleteKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis.del(key);
});
exports.deleteKey = deleteKey;
const setJSON = (key, value, expiry) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonString = JSON.stringify(value);
    yield (0, exports.setKey)(key, jsonString, expiry);
});
exports.setJSON = setJSON;
const getJSON = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const value = yield (0, exports.getKey)(key);
    return value ? JSON.parse(value) : null;
});
exports.getJSON = getJSON;
const incrementKey = (key_1, ...args_1) => __awaiter(void 0, [key_1, ...args_1], void 0, function* (key, amount = 1) {
    return yield redis.incrby(key, amount);
});
exports.incrementKey = incrementKey;
const existsKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield redis.exists(key)) === 1;
});
exports.existsKey = existsKey;
exports.default = redis;
