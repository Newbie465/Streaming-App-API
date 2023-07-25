import { FastifyReply, FastifyRequest } from "fastify";
import Application from "./app";

function main() {

    const app = new Application();

    return app.fastify;


}

const app = main()

export default async (req : FastifyRequest, res : FastifyReply) => {
    await app.ready();
    app.server.emit('request', req, res);
}