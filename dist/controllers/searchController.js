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
const searchServices_1 = __importDefault(require("../services/searchServices"));
const animeService = new searchServices_1.default;
const routes = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
        rep.status(200).send({
            message: "Welcome to the world of Anime"
        });
    }));
    fastify.get("/search/:query", {
        schema: {
            description: "Search Anything",
            tags: ["Search"],
            params: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                    }
                },
            },
            querystring: {
                page: {
                    type: "number",
                    default: 1
                }
            },
        }
    }, (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
        const query = req.params.query;
        const page = req.query.page || 1;
        try {
            const result = yield animeService.search(query, page);
            rep.status(200).send(result);
        }
        catch (error) {
            rep.status(404).send({
                message: "Something went wrong"
            });
        }
    }));
});
exports.default = routes;
//# sourceMappingURL=searchController.js.map