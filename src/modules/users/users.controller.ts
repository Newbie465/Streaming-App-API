import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody, LoginUserBody } from "./users.schema";
import { createUser, getUserFromEmail, validatePassword } from "./users.service";
import { logger } from "../../utils/logger";

export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBody
    }>,
    reply: FastifyReply
){

    const { ...data } = request.body;

    try {

        const user = await createUser(data)
        const token = await reply.jwtSign({
            id : user.id,
            email : user.email,
        })

        reply.status(200).send(
            {
                ...user,
                token
            }
        );

    }catch (err) {

        reply.status(500).send(err)
        logger.error(err)

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
                    error : "This Email does not exist"
                })

            }
            else if (!validatePassword(password, user.password)){

                reply.status(402).send({
                    error : "Password is incorrect"
                })

            }
            else{    

                const token = await reply.jwtSign({
                    id : user.id,
                    email : email
                })

                reply.status(200).send({
                    token : token,
                })
                
            }
            
        }catch(err) {

            reply.status(500).send({
                error : "Internal Server Error"
            })

        }

}
