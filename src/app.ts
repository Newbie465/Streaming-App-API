import fastify, { FastifyReply, FastifyRequest } from "fastify";
import search from "./modules/search/search.routes";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import oAuthMiddleware from "./utils/oAuthMiddleware";
import { configDotenv } from "dotenv";

configDotenv();

export default class Application {

    fastify = fastify({
        logger: true
    })

    constructor() {
            
        this.initialize()
            
    }
    
    initialize() {

        this.fastify.register(fastifySwagger, {
            swagger: {
                info : {
                    title : "Streaming Platform",
                    version : "0.0.1"
                },
                tags: [
                    { name: 'Search', description: 'All Search EndPoints' },
                    { name : 'Authentication', description: 'All Authentication EndPoints'}
                ]
            }
        });

        this.fastify.register(fastifySwaggerUi, {
            routePrefix : "/swagger/docs"
        })

        this.fastify.get("/", async (req : FastifyRequest, rep : FastifyReply) => {
            rep.status(200).send({
                message: "Welcome to the The Streaming Platform"
            })
        })
    
        this.fastify.register(search, {prefix: "/api/v1/search"})

        this.fastify.register(fastifyCors, {
            origin: "*",
        })
        
        this.fastify.register(oAuthMiddleware)
        
        this.fastify.listen({
            port: Number(process.env.PORT) || 3000,
            host: process.env.HOST || "localhost",
        })
            
    }
}