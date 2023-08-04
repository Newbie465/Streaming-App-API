"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const searchController_1 = __importDefault(require("./controllers/searchController"));
const swagger_1 = require("@fastify/swagger");
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const cors_1 = require("@fastify/cors");
const oAuthMiddleware_1 = __importDefault(require("./utils/oAuthMiddleware"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
class Application {
    constructor() {
        this.fastify = (0, fastify_1.default)({
            logger: true
        });
        this.initialize();
    }
    initialize() {
        this.fastify.register(swagger_1.fastifySwagger, {
            swagger: {
                info: {
                    title: "Streaming Platform",
                    version: "0.0.1"
                },
                tags: [
                    { name: 'Search', description: 'All Search EndPoints' },
                    { name: 'Authentication', description: 'All Authentication EndPoints' }
                ]
            }
        });
        this.fastify.register(swagger_ui_1.default, {
            routePrefix: "/swagger/docs"
        });
        this.fastify.register(searchController_1.default, { prefix: "/api/v1" });
        this.fastify.register(cors_1.fastifyCors, {
            origin: "*",
        });
        this.fastify.register(oAuthMiddleware_1.default);
        this.fastify.listen({
            port: Number(process.env.PORT) || 3000,
            host: process.env.HOST || "localhost",
        });
    }
}
exports.default = Application;
//# sourceMappingURL=app.js.map