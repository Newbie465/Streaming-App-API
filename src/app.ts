import fastify from "fastify";
import search from "./controllers/searchController";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export default class Application {

    fastify = fastify({
        logger: true
    })

    constructor() {

        this.fastify.register(fastifySwagger, {
            swagger: {
                info : {
                    title : "Streaming Platform",
                    version : "0.0.1"
                },
                tags: [
                    { name: 'Search', description: 'All Search EndPoints' },
                ]
            }
        });

        this.fastify.register(fastifySwaggerUi, {
            routePrefix : "/swagger/docs"
        })
        
        this.fastify.register(search, {prefix: "/api/v1"})

        this.fastify.listen({
            port: Number(process.env.PORT) || 8080,
            host: process.env.HOST || "0.0.0.0",
        })
    }

    
}