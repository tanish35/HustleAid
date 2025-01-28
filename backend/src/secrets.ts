import { config } from "dotenv";
config();

console.log("🗝️  Loading environment variables...");
const secrets = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  PORT: process.env.PORT,
};

//Validate that all environment variables are set
Object.entries(secrets).forEach(([key, value]) => {
  if (value === undefined || value === "") {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

console.log("🔐 Environment variables loaded.");
export default secrets;
