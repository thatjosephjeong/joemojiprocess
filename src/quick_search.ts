/*
    This is a bodged file to process inputs and search them in the Export JSON file
*/

import * as readline from "readline"
import { stemWord } from "./emojiProcessing/stemmer";
import { ingestPreviousExport } from "./map/ingest_map";
import { definedGet } from "./map/recursive_map";

async function search() {
    const map = ingestPreviousExport();

    console.log("I'll return the most related emoji I know in my database!\n");

    while (true) {
        let search_word = await askQuestion('');

        let stemmed_search_word = stemWord(search_word.toLowerCase());

        let emoji_list = definedGet(stemmed_search_word, map);
        let weights_of_emoji_list = emoji_list.map(x => x.weight);

        let highest_weight_index = weights_of_emoji_list.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

        const highest_weighted_emoji = emoji_list[highest_weight_index];
        if (highest_weighted_emoji == undefined) {
            console.log(search_word);
        } else {
            console.log(search_word, highest_weighted_emoji.char);
        }
        
    }
}

function askQuestion(query : string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer : Promise<string> = new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    })) 
    return answer
}


search()