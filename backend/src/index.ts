import express from "express";
import docVerify from "./routes/docVerify.routes";
import vendorRoutes from "./routes/vendorRoutes";
import userRoutes from "./routes/userRoutes";
import bankRoutes from "./routes/bankRoutes";
// import authRoutes from "./routes/authRoutes";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5174"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterMiddleware);

// req logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/verify", docVerify);
app.use("/api/vendor", vendorRoutes);
app.use("/api/bank", bankRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`);
});
