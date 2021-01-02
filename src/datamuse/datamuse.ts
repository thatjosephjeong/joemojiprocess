import * as axios from "axios";
import { ReturnedRequest, Word } from "./datamuse-interface";

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

export async function findRelatedWords(keywords_list : Readonly<string[]>)  {
    // : Promise<Readonly<ReturnedRequest[]>>
    let expanded_keywords : ReturnedRequest[] = await Promise.all(keywords_list.map(
        // send requests on each keyword
        async (keyword: string) => {
            const related_words = await sendRelatedWordRequest(keyword);
            const out_object : ReturnedRequest = {
                original_word: keyword,
                related_words: related_words
            }
            return out_object;
        })
    );
    return expanded_keywords;
}