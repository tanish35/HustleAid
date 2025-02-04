"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: "My API",
        description: "API Description",
    },
    host: "localhost:3000",
    schemes: ["http"],
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/index.ts"]; // Path to your main Express app file
// Call swaggerAutogen as a function and then use .then()
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger documentation generated");
});
