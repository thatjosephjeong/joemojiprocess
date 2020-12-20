import { readFromData } from "../data/read_from_data";
import { EmojiImport, EmojiMap } from "../interfaces/ingest_interfaces";
import { buildOriginalMap } from "../map/original_map";
import { removeDiacritics } from "./remove_diacritics";


export function ingestEmojisAsObject() : Readonly<EmojiImport> {
    return removeDiacriticsInImport( separateOutUnderscoreKeywords( addKeysToKeywords( readEmojiJSON())));
}

export function ingestEmojisAsMap() : EmojiMap {
    return buildOriginalMap(ingestEmojisAsObject());
}

function readEmojiJSON() : Readonly<any> {
    // synchronously ingests the entire file
    return readFromData('emoji')
}

function addKeysToKeywords(emoji_import : EmojiImport) : Readonly<EmojiImport> {
    // adds the key of the emoji into the emoji object keywords

    var emojis : EmojiImport = emoji_import;

    // push the keys into the keyword string array
    Object.keys(emoji_import).forEach(x => emojis[x].keywords.push(x));

    return emojis;
}

function separateOutUnderscoreKeywords(emoji_import : EmojiImport) : Readonly<EmojiImport> {
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

function removeDiacriticsInImport(emoji_import : EmojiImport) : Readonly<EmojiImport> {
    
    var emojis : EmojiImport = emoji_import;

    // only keywords are ingested - therefore only need to localise keywords
    Object.keys(emoji_import).forEach(x => emoji_import[x].keywords.map(
        keyword => {
            let normalised = removeDiacritics(keyword)
            if (normalised != keyword) {
                emojis[x].keywords.push(normalised)
                // remove the key from the list
                emojis[x].keywords = emojis[x].keywords.filter(word => !(word == keyword));
            }
        }
    ))

    return emojis;

}