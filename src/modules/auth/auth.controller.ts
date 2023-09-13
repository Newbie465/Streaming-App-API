import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody, LoginUserBody, RefreshBody } from "./auth.schema";
import { createUser, getUserFromEmail, signAccessToken, signRefreshToken, validatePassword, verifyRefreshToken } from "./auth.service";
import { sign } from "crypto";
import { C } from "drizzle-orm/column.d-04875079";

export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBody
    }>,
    reply: FastifyReply
){

    const { ...data } = request.body;

    try {

        const user = await createUser(data)

        const accessToken = await signAccessToken(user.id, user.email, reply)
        
        const refreshToken = await signRefreshToken(user.id, user.email, reply)

        reply.status(200)
        .setCookie("refreshToken", refreshToken as string, {
            httpOnly: true
        })
        .send(
            {
                ...user,
                accessToken,

            }
        )

    }catch (err) {

        reply.status(400).send(err)

    }

}

export async function loginHandler(
    
    request: FastifyRequest<{
        Body: LoginUserBody
    }>, 
    reply : FastifyReply
    
    ){

        const {email, password} = request.body

        try {

            const user = await getUserFromEmail(email)

            if(!user) {

                reply.status(404).send({
                    error : "User Not Registered",
                })

            }
            else if (!validatePassword(password, user.password)){

                reply.status(401).send({
                    error : "Username/Password is incorrect"
                })

            }
            else{    

                const accessToken = await signAccessToken(user.id, email, reply)

                const refreshToken = await signRefreshToken(user.id, email, reply)

                reply.status(200)
                .setCookie("refreshToken", refreshToken as string, {
                    httpOnly: true,
                    sameSite: false
                })
                .send({
                    accessToken,
                })
                
            }
            
        }catch(err) {

            reply.status(500).send(err)

        }

}

export async function refreshTokenHanlder(
    request : FastifyRequest<{
        Body : RefreshBody
    }>,
    reply : FastifyReply
) {
    try {

        const { id, email } = await request.refreshTokenVerify({onlyCookie: true}) as {id : string, email : string}

        const accessToken = await signAccessToken(id, email, reply)
        const refreshToken = await signRefreshToken(id, email, reply)

        reply.status(200)
        .setCookie("refreshToken", refreshToken as string, {
            httpOnly : true
        }).send({
            accessToken,
        })


    }catch(error : any) {

        if(error.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID"){
            reply.status(401).send({ message: "Unauthorized"})
        }

        reply.status(401).send({
            message : error.message
        }) 
    }
}
