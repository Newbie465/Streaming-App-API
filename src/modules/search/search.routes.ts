import { FastifyInstance, FastifyReply, FastifyRequest, RegisterOptions } from "fastify";
import SearchServices from "./search.service";

const animeService = new SearchServices

const routes = async (fastify : FastifyInstance, options: RegisterOptions) => {

    fastify.get("/:query", {
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
            querystring: {
                page : {
                    type: "number" , 
                    default : 1
                }
            },
            response : {
                200: {
                    type: 'object',
                    properties : {
                        currentPage : { type: "number" },
                        hasNextPage : { type:  "boolean" },
                        results : {
                            type : "array",
                            items : {
                                type : "object",
                                properties : {
                                    id : { type: "string" },
                                    title : { type: "string" },
                                    image : { type: "string" },
                                    releaseDate : { type: "string" },
                                    dubId : { type: "string" },
                                    type : { type: "string"},
                                }
                            }
                        }
                    },
                }
            }            
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