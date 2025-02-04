"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
console.log("🗝️  Loading environment variables...");
const secrets = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
};
//Validate that all environment variables are set
Object.entries(secrets).forEach(([key, value]) => {
    if (value === undefined || value === "") {
        console.error(`Missing environment variable: ${key}`);
        process.exit(1);
    }
});
console.log("🔐 Environment variables loaded.");
exports.default = secrets;
