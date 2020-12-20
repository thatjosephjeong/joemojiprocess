import { Emoji, EmojiImport, EmojiMap, MapEmoji } from "src/interfaces/ingest_interfaces";

export function buildOriginalMap(emojis : EmojiImport) : EmojiMap {
    // create a new map with words as their strings
    var map_words : EmojiMap = new Map();
 
    Object.keys(emojis).forEach(key =>
        {map_words = addOriginalKeywords(map_words, emojis[key].keywords, convertOriginalEmojiToMapEmoji(emojis[key]))
    })

    return map_words;
}

function addOriginalKeywords(map : EmojiMap, key_list : string[], emoji : MapEmoji) {

    // for every item in the keylist
    for (let x in key_list) {
        let key = key_list[x].toLowerCase();

        // get the contents of the map in that key
        let contents = map.get(key);

        // if the key doesn't exist, set it as the emoji
        if (contents == undefined) {
            map.set(key, [emoji]);
        } else {
            // if the key does exist
            var arr = [];
            for (let i in contents) {
                // create a new array
                let face_array = arr.map(emoji => emoji.char);
                if (face_array.indexOf(emoji.char) < 0) {
                    arr.push(contents[i]);
                }                
            } if (arr != undefined) {
                // push the emoji new emoji into this array if it doesn't already exist
                let face_array = arr.map(emoji => emoji.char);
                if (face_array.indexOf(emoji.char) < 0) {arr.push(emoji)}
                // set this as the map
                map.set(key, arr);
            }
        }
    }  
    return map
}

function convertOriginalEmojiToMapEmoji(emoji : Emoji) {
    const map_emoji : MapEmoji = 
    {
        char: emoji.char,
        fitzpatrick_scale: emoji.fitzpatrick_scale,
        weight: 2000
    };
    return map_emoji;
}