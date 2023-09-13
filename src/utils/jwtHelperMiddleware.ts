import fastifyJwt = require("@fastify/jwt");
import { FastifyInstance, FastifyReply, FastifyRequest, onRequestHookHandler } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module 'fastify' {
    interface FastifyInstance {
        authenticate : onRequestHookHandler;
    }
    interface FastifyRequest {
        accessTokenVerify : () => Promise<fastifyJwt.VerifyPayloadType>
        refreshTokenVerify : (options?: Partial<fastifyJwt.VerifyOptions>) => Promise<fastifyJwt.VerifyPayloadType>
    }
    interface FastifyReply {
        accessTokenSign : (payload: {
            id: string;
            email: string;
        }, options?: Partial<fastifyJwt.SignOptions> | undefined) => Promise<String>

        refreshTokenSign : (payload: {
            id: string;
            email: string;
        }, options?: Partial<fastifyJwt.SignOptions> | undefined) => Promise<String>
    }

  }

async function jwtHelperMiddleware(fastify: FastifyInstance) {

    fastify.register(fastifyJwt, {
        secret : process.env.ACCESSTOKENSECRET as string,
        namespace : 'accessToken',
        jwtVerify : 'accessTokenVerify',
        jwtSign : 'accessTokenSign',

    })

    fastify.register(fastifyJwt, {
        secret : process.env.REFRESHTOKENSECRET as string,
        namespace : 'refreshToken',
        jwtVerify : 'refreshTokenVerify',
        jwtSign : 'refreshTokenSign',
        cookie : {
            cookieName : 'refreshToken',
            signed : false
        }

    })

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply){

        try { 

            await request.accessTokenVerify()

        }catch (error : any) {

            if(error.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID"){
                reply.status(401).send({ message: "Unauthorized"})
            }

            reply.status(401).send({
                message : error.message
            }) 
        }

    })

}

export default fastifyPlugin(jwtHelperMiddleware)