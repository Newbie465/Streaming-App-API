import { ANIME, MOVIES } from "@consumet/extensions";
import { SearchData, SearchObject, SearchResponse } from "./search.schema";

export default class SearchServices {

    private anime = new ANIME.Gogoanime();
    private movie = new MOVIES.FlixHQ();
    response : Array<SearchData> = []

    async search (query: string, page: number) : Promise<SearchObject> {

        const searchData : SearchObject = await this.getAllDataAndAssemble(query, page);

        return searchData;

    }

    private combineSubAndDub (obj : Array<SearchResponse>) : Array<SearchData> {

        const dub = obj.filter(d => d.subOrDub === "dub")
        const sub = obj.filter(s => s.subOrDub === "sub")
    
        const result : Array<SearchData> = sub.map(element => {
            const dubId = dub.find(d => d.id === element.id+"-dub" || d.title === element.title+" (Dub)")
            return {
                id: element.id,
                title: element.title,
                image: element.image,
                releaseDate: element.releaseDate.split(" ")[1],
                dubId: dubId?.id,
            }
        });
    
        return result;
    
    }

    private addTypeToAnime(obj : Array<SearchData>): Array<SearchData> {

        const result : Array<SearchData> = obj.map(element => {
            const type = () => {
                if (String(element.id).includes("movie") || String(element.id).includes("film")){
                    return "Movie"
                }else{
                    return "TV Series"
                }
            }
            return {
                ...element,
                type: type(),
            }
        });

        return result;

    }

    private removeDupilates (obj : Array<SearchResponse>, anime? : Array<SearchResponse>, movie? : Array<SearchResponse>) : Array<SearchData> {

        let unique : Array<string> = [];
        let uniqueObj : Array<SearchData> = [];

        obj.forEach(element => {
            if (!unique.includes(element.title)){
                unique.push(element.title);
                uniqueObj.push(element);
            }
        });

        return uniqueObj;

    }

    private async getAllDataAndAssemble (query : string, page : number) : Promise<SearchObject>{

        const animeResponse =  await this.anime.search(query, page)
        const movieResponse = await this.movie.search(query, page);
        const animeCombined = this.combineSubAndDub(animeResponse.results as Array<SearchResponse>)
        const animeAdddedType = this.addTypeToAnime(animeCombined)
        const searchList = [
            ...animeAdddedType,
            ...movieResponse.results as Array<SearchResponse>,
        ]

        const searchListWithoutDups = this.removeDupilates(searchList as Array<SearchResponse>)


        const response : SearchObject = {
            currentPage: animeResponse.currentPage,
            hasNextPage: animeResponse.hasNextPage ? animeResponse.hasNextPage : movieResponse.hasNextPage,
            results: searchListWithoutDups,
        
        }

        return response;

    }

    




}