import express from "express";
import aadharRoutes from "./routes/aadharRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

app.use("/api/aadhar", aadharRoutes);
app.use("/api/vendor", vendorRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
