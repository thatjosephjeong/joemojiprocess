import * as axios from "axios";

import { readFromData } from "../data/read_from_data";
import { Config } from "../interfaces/config_interface";
import { EmojiMap } from "../interfaces/ingest_interfaces";
import { ReturnedRequest, Word } from "src/interfaces/datamuse_interfaces";

export async function findRelatedWordsList(original_map : Readonly<EmojiMap>) {
    return await findRelatedWords (
        sliceKeywords(Array.from(original_map.keys()))
    )
}

async function findRelatedWords(keywords_list : Readonly<string[][]>) : Promise<Readonly<ReturnedRequest[]>> {

    var expanded_keywords_list : ReturnedRequest[][] = []

    for (let i in keywords_list) {
        let keywords_batch = keywords_list[i]
        // await for all the requests to be sent
        // for every key in one array
        let expanded_keywords : ReturnedRequest[] = await Promise.all(keywords_batch.map(
            // send requests on each keyword
            async (keyword: string) => {
                const related_words = await sendRelatedWordRequest(keyword);
                const out_object : ReturnedRequest = {
                    original_word: keyword,
                    related_words: related_words
                }
                return out_object;
            }));
        expanded_keywords_list.push(expanded_keywords);
    }

    const flattened_expanded_keywords : ReturnedRequest[] = expanded_keywords_list.flat(1);

    return flattened_expanded_keywords;

    // not sure why this alternative code doesn't work

    // const expanded_keywords : ReturnedRequest[][] = await Promise.all(keywords_list.map(async (keywords_batch) => {
    //     const thing : ReturnedRequest[] = await Promise.all(keywords_batch.map(async (keyword) => {
    //         const related_words = await sendRelatedWordRequest(keyword);
    //         const out_object : ReturnedRequest = {
    //             original_word: keyword,
    //             related_words: related_words
    //         }
    //         return out_object;
    //     }))
    //     return thing;
    // }));
    // const flattened_expanded_keywords : Readonly<ReturnedRequest[]> = expanded_keywords.flat(1);

    // return flattened_expanded_keywords;

}

function sliceKeywords(keys : string[]) : Readonly<string[][]> {
    
    const max_async_requests = readMaxUlimitFromConfig();
    
    var key_list : string[][] = [];
    for (let i : number = 0; i <= keys.length; i += max_async_requests) {
        key_list.push(keys.slice(i, i + max_async_requests));
    }

    return key_list;
}

function readMaxUlimitFromConfig() : Readonly<number> {
    const configFile : Readonly<Config> = readFromData('config')
    return configFile.max_ulimit;
}

async function sendRelatedWordRequest(word : string) : Promise<Word[]> {

    //use datamuse to find related words
    const url = 'https://api.datamuse.com/words?';
    const queryParams = 'rel_trg=';
    console.log(' finding similar words to: ', word)
    const wordQuery = word
    const endpoint = url + queryParams + wordQuery;
    var output : Word[] = [];
    try {
        let response = await axios.default.get(endpoint)
        if (response.status == 200) {
            console.log('found similar words to: ', word)
            output = response.data;
        }
    } catch (error) {
        console.log(error);
    }

    return output
}
