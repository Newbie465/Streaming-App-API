import { FastifyInstance, FastifyReply, FastifyRequest, RegisterOptions } from "fastify";
import SearchServices from "../services/searchServices";

const animeService = new SearchServices

const routes = async (fastify : FastifyInstance, options: RegisterOptions) => {

    fastify.get("/", (req : FastifyRequest, rep : FastifyReply) => {
        rep.status(200).send({
            message: "Welcome to the world of Anime"
        })
    })

    fastify.get("/search/:query", {
        schema : {
            description : "Search Anything",
            tags : ["Search"],
            params : {
                type : 'object',
                properties : {
                    query : {
                        type : 'string',
                    }
                },
            },
            querystring : {
                page : {
                    type: "number" , 
                    default : 1
                }
            },
            
        }
    }, async (req : FastifyRequest, rep : FastifyReply) =>{
        const query = (req.params as {query : string}).query
        const page = (req.query as { page: number }).page || 1;

        try {

            const result = await animeService.search(query, page)
            rep.status(200).send(result)

        } catch (error) {

            rep.status(404).send({
                message: "Something went wrong"
            })

        }
    })

}

export default routes;