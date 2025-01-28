import express from "express";
import aadharRoutes from "./routes/aadharRoutes";

const app = express();

app.use(express.json());

app.use("/api", aadharRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
