"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const extensions_1 = require("@consumet/extensions");
class SearchServices {
    constructor() {
        this.anime = new extensions_1.ANIME.Gogoanime();
        this.movie = new extensions_1.MOVIES.FlixHQ();
        this.response = [];
    }
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchData = yield this.getAllDataAndAssemble(query, page);
            return searchData;
        });
    }
    combineSubAndDub(obj) {
        const dub = obj.filter(d => d.subOrDub === "dub");
        const sub = obj.filter(s => s.subOrDub === "sub");
        const result = sub.map(element => {
            const dubId = dub.find(d => d.id === element.id + "-dub" || d.title === element.title + " (Dub)");
            return {
                id: element.id,
                title: element.title,
                image: element.image,
                releaseDate: element.releaseDate.split(" ")[1],
                dubId: dubId === null || dubId === void 0 ? void 0 : dubId.id,
            };
        });
        return result;
    }
    addTypeToAnime(obj) {
        const result = obj.map(element => {
            const type = () => {
                if (String(element.id).includes("movie") || String(element.id).includes("film")) {
                    return "Movie";
                }
                else {
                    return "TV Series";
                }
            };
            return Object.assign(Object.assign({}, element), { type: type() });
        });
        return result;
    }
    removeDupilates(obj, anime, movie) {
        let unique = [];
        let uniqueObj = [];
        obj.forEach(element => {
            if (!unique.includes(element.title)) {
                unique.push(element.title);
                uniqueObj.push(element);
            }
        });
        return uniqueObj;
    }
    getAllDataAndAssemble(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const animeResponse = yield this.anime.search(query, page);
            const movieResponse = yield this.movie.search(query, page);
            const animeCombined = this.combineSubAndDub(animeResponse.results);
            const animeAdddedType = this.addTypeToAnime(animeCombined);
            const searchList = [
                ...animeAdddedType,
                ...movieResponse.results,
            ];
            const searchListWithoutDups = this.removeDupilates(searchList);
            const response = {
                currentPage: animeResponse.currentPage,
                hasNextPage: animeResponse.hasNextPage ? animeResponse.hasNextPage : movieResponse.hasNextPage,
                results: searchListWithoutDups,
            };
            return response;
        });
    }
}
exports.default = SearchServices;
//# sourceMappingURL=search.service.js.map