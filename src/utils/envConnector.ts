import fastifyEnv from "@fastify/env"
import { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin";

declare module 'fastify' {
    interface FastifyInstance {
      config: { 
        PORT : string,
        HOST : string,
      };
    }
}

const envSchema = {
    type: 'object',
    required: [ 'PORT' ],
    properties: {
        PORT: {
            type: "integer",
            default: 3000
        },
        HOST: {
            type: 'string',
            default: '0.0.0.0'
        }
    }
}

const options = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true,
}

async function envConnector(fastify : FastifyInstance) {

    fastify.register(fastifyEnv, options);

}

export default fastifyPlugin(envConnector);