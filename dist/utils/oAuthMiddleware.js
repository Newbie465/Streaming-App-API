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
const oauth2_1 = require("@fastify/oauth2");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
function oAuth2Middleware(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.register(oauth2_1.fastifyOauth2, {
            name: "googleOAuth2",
            scope: ['profile email'],
            credentials: {
                client: {
                    id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                    secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET
                },
                auth: oauth2_1.fastifyOauth2.GOOGLE_CONFIGURATION,
            },
            startRedirectPath: '/api/v1/auth/google',
            callbackUri: 'http://localhost:3000/api/v1/auth/google/callback'
        });
        fastify.get("/api/v1/auth/google/callback", {
            schema: {
                description: "Google Authenticator",
                tags: ["Authentication"]
            }
        }, function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = yield fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
                console.log({ token });
                res.redirect("http://localhost:3001/?token=" + token.token.access_token);
            });
        });
    });
}
exports.default = (0, fastify_plugin_1.default)(oAuth2Middleware);
//# sourceMappingURL=oAuthMiddleware.js.map