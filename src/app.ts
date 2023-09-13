import fastify, { FastifyReply, FastifyRequest } from "fastify";
import search from "./modules/search/search.routes";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import oAuthMiddleware from "./utils/oAuthMiddleware";
import { configDotenv } from "dotenv";
import {migrate} from "drizzle-orm/node-postgres/migrator"
import { db } from "./db";
import { env } from "process";
import { usersRoutes } from "./modules/auth/auth.route";
import { fastifyJwt } from "@fastify/jwt";
import jwtHelperMiddleware from "./utils/jwtHelperMiddleware";
import { fastifyCookie } from "@fastify/cookie";

configDotenv();
declare module "@fastify/jwt" {
    interface FastifyJWT {
      payload: { 
        id: string, 
        email: string 
        }
      user: {
            id : string,
            email: string,
        }
    }
}
export default class Application {

    fastify = fastify({
        logger: true,
    })

    constructor() {
            
        this.initialize()
            
    }
    
    async initialize() {

        this.fastify.register(fastifySwagger, {
            swagger: {
                    info : {
                        title : "Streaming Platform",
                        version : "0.0.1"
                    },
                    tags: [
                        { name: 'Search', description: 'All Search EndPoints' },
                        { name : 'Authentication', description: 'All Authentication EndPoints'},
                    ],
                    securityDefinitions : {
                        bearerAuth : {
                            type: 'apiKey',
                            name: 'Authorization',
                            in : 'header'
                        }
                    }
                }
            }
        );

        this.fastify.register(fastifyCookie)

        this.fastify.register(fastifySwaggerUi, {
            routePrefix : "/swagger/docs"
        })

        
        this.fastify.register(fastifyCors, {
            origin: "*",
        })
        
        this.fastify.register(oAuthMiddleware)
        this.fastify.register(jwtHelperMiddleware)
        
        this.fastify.get("/" ,async (req : FastifyRequest, rep : FastifyReply) => {
            rep.status(200).send({
                message: "Welcome to the The Streaming Platform"
            })
        })

        this.fastify.register(search, {prefix: "/api/v1/search"})
        this.fastify.register(usersRoutes, {prefix: "api/v1/auth"})
        
        await this.fastify.listen({
            port: Number(process.env.PORT),
            host: process.env.HOST,
        })

        await migrate(db, {
            migrationsFolder : "./migrations-folder"
        }).catch(error => console.log(error))
            
    }
}
