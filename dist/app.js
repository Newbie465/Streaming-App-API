"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const searchController_1 = __importDefault(require("./controllers/searchController"));
const swagger_1 = require("@fastify/swagger");
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const dotenv = __importStar(require("dotenv"));
class Application {
    constructor() {
        this.fastify = (0, fastify_1.default)({
            logger: true
        });
        this.dotenv = dotenv;
        this.dotenv.config();
        this.fastify.register(swagger_1.fastifySwagger, {
            swagger: {
                info: {
                    title: "Streaming Platform",
                    version: "0.0.1"
                },
                tags: [
                    { name: 'Search', description: 'All Search EndPoints' },
                ]
            }
        });
        this.fastify.register(swagger_ui_1.default, {
            routePrefix: "/swagger/docs"
        });
        this.fastify.register(searchController_1.default, { prefix: "/api/v1" });
        this.fastify.listen({
            port: Number(process.env.PORT) || 8080,
            host: process.env.HOST || "0.0.0.0",
        });
    }
}
exports.default = Application;
//# sourceMappingURL=app.js.map