import fastify, { FastifyInstance } from "fastify";
import search from "./controllers/searchController";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import envConnector from "./utils/envConnector";

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
                ]
            }
        });

        this.fastify.register(fastifySwaggerUi, {
            routePrefix : "/swagger/docs"
        })

        
        
        this.fastify.register(search, {prefix: "/api/v1"})
        
        this.fastify.register(envConnector).ready(err => {
            if(err) console.log(err)

            this.fastify.listen({
                port: Number(this.fastify.config.PORT) || 8080,
                host: this.fastify.config.HOST || "localhost",
            })
            
        })

    }
}