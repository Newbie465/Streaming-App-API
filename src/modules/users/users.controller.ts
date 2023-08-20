import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody, LoginUserBody } from "./users.schema";
import { createUser, getUserFromEmail, validatePassword } from "./users.service";

export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBody
    }>,
    reply: FastifyReply
){

    const { ...data } = request.body;

    try {

        const user = await createUser(data)
        const accessToken = await reply.accessTokenSign({
            id : user.id,
            email : user.email,
        }, {
            expiresIn : "1m",
        })

        const refreshToken = await reply.refreshTokenSign({
            id : user.id,
            email : user.email,
        }, {
            expiresIn : "30d",
        })

        reply.status(200).send(
            {
                ...user,
                accessToken,
                refreshToken,

            }
        );

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

                const accessToken = await reply.accessTokenSign({
                    id : user.id,
                    email : email
                }, {
                    expiresIn : "1m",
                })

                const refreshToken = await reply.refreshTokenSign({
                    id : user.id,
                    email : user.email,
                }, {
                    expiresIn : "30d",
                })

                reply.status(200).send({
                    accessToken,
                    refreshToken
                })
                
            }
            
        }catch(err) {

            reply.status(500).send(err)

        }

}
