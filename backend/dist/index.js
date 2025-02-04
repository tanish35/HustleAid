"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aadharRoutes_1 = __importDefault(require("./routes/aadharRoutes"));
const vendorRoutes_1 = __importDefault(require("./routes/vendorRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bankRoutes_1 = __importDefault(require("./routes/bankRoutes"));
// import authRoutes from "./routes/authRoutes";
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:5174"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(rateLimiter_1.rateLimiterMiddleware);
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger-output.json"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.use(express_1.default.json());
app.use("/api/auth", userRoutes_1.default);
app.use("/api/aadhar", aadharRoutes_1.default);
app.use("/api/vendor", vendorRoutes_1.default);
app.use("/api/bank", bankRoutes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
