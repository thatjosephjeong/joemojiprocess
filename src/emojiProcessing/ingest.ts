import { readFromData } from "../data/read_from_data";
import { EmojiImport } from "../interfaces/emojis_interfaces";
import { buildOriginalMap } from "../map/original_map";


export function ingestEmojisAsObject() {
    return separateOutUnderscoreKeywords( addKeysToKeywords( readEmojiJSON()));
}

export function ingestEmojisAsMap() {
    return buildOriginalMap(ingestEmojisAsObject());
}

function readEmojiJSON() {
    // synchronously ingests the entire file
    return readFromData('emoji')
}

function addKeysToKeywords(emoji_import : EmojiImport) {
    // adds the key of the emoji into the emoji object keywords

    var emojis : EmojiImport = emoji_import;

    // push the keys into the keyword string array
    Object.keys(emoji_import).forEach(x => emojis[x].keywords.push(x));

    return emojis;
}

function separateOutUnderscoreKeywords(emoji_import : EmojiImport) {
    // separate out phrases to individual words

    var emojis : EmojiImport = emoji_import;

    Object.keys(emoji_import).forEach(function(key) {

        // add the separated out words into the emojis keywords
        emoji_import[key].keywords.map(x =>  separateOutWordsInPhrase(x).map(y => emojis[key].keywords.push(y)));

        // remove the key from the list
        emojis[key].keywords = emojis[key].keywords.filter(word => !(word == key));
    });

    return emojis;
}

function separateOutWordsInPhrase(phrase : string) : string[] {
    
    // splitting with regex keeps the delimiters so can't really use
    // /([-,_, ])/g

    const separated = ((phrase.split("_").map(x => x.split("-")).map(x => x.map(x => x.split(' ')))).flat(3));

    return separated;
}