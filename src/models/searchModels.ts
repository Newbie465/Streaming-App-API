export type SearchData = {
    id : string;
    title : string;
    image : string;
    releaseDate : string;
    dubId? : string;
    season? : string;   
    type? : string;
}

export type SearchObject = {
    currentPage? : number;
    hasNextPage? : boolean;
    results : Array<SearchData>;
}

export type SearchResponse = {
    id: string
    title: string,
    url: string,
    image: string,
    releaseDate: string,
    subOrDub?: string,
    season?: string,
    type?: string
}