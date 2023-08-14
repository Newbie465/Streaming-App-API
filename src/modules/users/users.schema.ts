import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(8),
})

const userResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email : z.string().email(),
    token : z.string(),
})

const loginUserBodySchema = z.object({
    email : z.string().email(),
    password: z.string().min(8),
})

const loginResponseSchema = z.object({
    token : z.string(),
})

export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type LoginUserBody = z.infer<typeof loginUserBodySchema>

export const createUserJsonSchema = {
    tags: ['Users'],
    response : {
        200 : zodToJsonSchema(userResponseSchema),
    },
    body : zodToJsonSchema(createUserBodySchema), 
}

export const loginUserJsonSchema = {
    tags: ["Users"],
    body : zodToJsonSchema(loginUserBodySchema),
    response : {
        200 : zodToJsonSchema(loginResponseSchema),
    }
}