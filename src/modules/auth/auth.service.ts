import { InferModel, eq } from "drizzle-orm";
import { users } from "../../db/schema";
import { db } from "../../db";
import { compareSync, hashSync } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createUser(data: InferModel<typeof users, "insert">) {

    const hashedPassword = hashSync(data.password, Number(process.env.SECRET))

    const result = await db.insert(users).values({

        ...data,
        password: hashedPassword,

    }).returning({

        id : users.id,
        email : users.email,

    })

    return result[0]

}

export async function getUserFromEmail(email: string){

    const result = await db
        .select({
            id : users.id,
            email : users.email,
            name : users.name,
            password : users.password,
        })
        .from(users)
        .where(
            eq(users.email , email)
        )

    if(!result.length){
        return null
    }

    return result[0]; 

}

export function validatePassword(password: string, hashedPassword: string){

    return compareSync(password, hashedPassword)

}

export async function signAccessToken(id : string, email: string, reply: FastifyReply) {

    const accessToken = await reply.accessTokenSign({
        id : id,
        email : email
    }, {
        expiresIn : "15m",
    })

    return accessToken

}

export async function signRefreshToken(id : string, email: string, reply: FastifyReply) {

    const refreshToken = await reply.refreshTokenSign({
        id : id,
        email : email
    }, {
        expiresIn : "30d",
    })

    return refreshToken

}

export async function verifyRefreshToken(request : FastifyRequest){

    try {
        
        
        const result = await request.refreshTokenVerify({onlyCookie: true})
        return result


    } catch (error) {
        console.error(error)
    }

}


