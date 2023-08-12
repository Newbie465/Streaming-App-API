import { FastifyInstance } from "fastify";
import { createUserHandler, loginHandler } from "./users.controller";
import { createUserJsonSchema, loginUserJsonSchema } from "./users.schema";

export async function usersRoutes(fastify: FastifyInstance) {

    fastify.post('/', {

        schema: createUserJsonSchema

    }, createUserHandler)

    fastify.post("/login", {

        schema : loginUserJsonSchema
        
    }, loginHandler)

}
