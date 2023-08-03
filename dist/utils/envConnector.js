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
const env_1 = __importDefault(require("@fastify/env"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const envSchema = {
    type: 'object',
    required: ['PORT'],
    properties: {
        PORT: {
            type: "integer",
            default: 3000
        },
        HOST: {
            type: 'string',
            default: '0.0.0.0'
        }
    }
};
const options = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true,
};
function envConnector(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.register(env_1.default, options);
    });
}
exports.default = (0, fastify_plugin_1.default)(envConnector);
//# sourceMappingURL=envConnector.js.map