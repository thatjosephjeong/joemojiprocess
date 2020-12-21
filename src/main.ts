import { findRelatedWordsList } from "./emojiProcessing/datamuse";
import { exportMapToJSONObject } from "./emojiProcessing/export";
import { ingestEmojisAsMap } from "./emojiProcessing/ingest";
import { EmojiMap } from "./interfaces/ingest_interfaces";
import { addRelatedWordsToMap } from "./map/recursive_map";
import { ingestPreviousExport } from "./map/ingest_map";

import * as readline from "readline"

async function main() {

    var original_emojis_map : EmojiMap= new Map();

    const iterations = await askForQuestion('Where do you want to import the file? \n 0 - emoji.json, \n 1 - the previous export.json\n');
    if (iterations === 0) {
        // import the original JSON file in a map format
        original_emojis_map = ingestEmojisAsMap();
    } else {
        original_emojis_map = ingestPreviousExport();
    }
    // find related words from datamuse
    const new_emoji_list = await findRelatedWordsList(original_emojis_map)

    // add related words to a new map
    const new_emoji_map = await addRelatedWordsToMap(new_emoji_list, original_emojis_map);

    exportMapToJSONObject(new_emoji_map);   
}

async function askForQuestion(query : string) {
    const iterations_string : string = await askQuestion(query);
    const iterations = parseInt(iterations_string);
    return iterations;
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


main()