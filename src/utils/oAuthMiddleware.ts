import { fastifyOauth2 } from "@fastify/oauth2";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

async function oAuth2Middleware(fastify: FastifyInstance){
    
    fastify.register(fastifyOauth2,{
        name: "googleOAuth2",
        scope: ['profile email'], 
        credentials: {
            client: {
                id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET
            },

            auth: fastifyOauth2.GOOGLE_CONFIGURATION, 
        },
        startRedirectPath: '/api/v1/auth/google', 
        callbackUri: 'http://localhost:3000/api/v1/auth/google/callback'
    })

    fastify.get("/api/v1/auth/google/callback", {
        schema : {
            description: "Google Authenticator",
            tags : ["Authentication"]
        }
    }, async  function (req, res) {

        const token =  await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
        console.log({ token });
        res.redirect("http://localhost:3001/?token="  + token.token.access_token)
        
    })

}

export default fastifyPlugin(oAuth2Middleware);