import { FastifyInstance } from "fastify";
import { createUserHandler, loginHandler, refreshTokenHanlder } from "./auth.controller";
import { createUserJsonSchema, loginUserJsonSchema, refreshJsonSchema } from "./auth.schema";

export async function usersRoutes(fastify: FastifyInstance) {

    fastify.post('/register', {

        schema: createUserJsonSchema

    }, createUserHandler)

    fastify.post("/login", {

        schema : loginUserJsonSchema
        
    }, loginHandler)

    fastify.get("/refresh", {

        schema : refreshJsonSchema
        
    }, refreshTokenHanlder)

}
