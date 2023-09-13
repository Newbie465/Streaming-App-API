import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(8),
})

const userResponseSchema = z.object({
    id: z.string().uuid(),
    email : z.string().email(),
    accessToken : z.string(),
})

const loginUserBodySchema = z.object({
    email : z.string().email(),
    password: z.string().min(8),
})

const loginResponseSchema = z.object({
    accessToken : z.string(),
})

const refreshTokenResponseSchema = z.object({
    refreshToken : z.string()
})

export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type LoginUserBody = z.infer<typeof loginUserBodySchema>
export type RefreshBody = z.infer<typeof refreshTokenResponseSchema>

export const createUserJsonSchema = {
    tags: ['Authentication'],
    response : {
        200 : zodToJsonSchema(userResponseSchema),
    },
    body : zodToJsonSchema(createUserBodySchema), 
}

export const loginUserJsonSchema = {
    tags: ["Authentication"],
    body : zodToJsonSchema(loginUserBodySchema),
    response : {
        200 : zodToJsonSchema(loginResponseSchema),
    }
}

export const refreshJsonSchema = {
    tags : ["Authentication"],
    response : {
        200 : {
            type : 'object',
            properties : {
                accessToken : { type: 'string' }
            }
        }
    }
}