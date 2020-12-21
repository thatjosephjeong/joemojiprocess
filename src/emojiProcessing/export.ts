import { EmojiMap, MapEmoji } from "src/interfaces/ingest_interfaces";
import { stemWord } from "./stemmer";
import { definedGet } from "../map/recursive_map"
import { readFromData } from "../data/read_from_data";
import { Config } from "../interfaces/config_interface";
import { ExportObject } from "src/interfaces/export_interfaces";

import * as fs from "fs"
import * as path from "path"

export function exportMapToJSONObject(original_emoji_map : EmojiMap) {

    const new_emoji_map = createNewStemmedMap(original_emoji_map);
    saveFile(Object.fromEntries(new_emoji_map));
}

function saveFile(export_object : ExportObject) {
    fs.writeFileSync(findExportFileName(), JSON.stringify(export_object, null, 1));
}

function createNewStemmedMap(original_emoji_map : EmojiMap) {
    
    var export_emoji_map : EmojiMap = new Map();

    Array.from(original_emoji_map.keys()).forEach(key => {
        const stemmed_word = stemWord(key);

        console.log('adding ', stemmed_word, ' as a stemmed word to output');

        let check = export_emoji_map.get(stemmed_word)
        let adding_values = definedGet(key, original_emoji_map)

        if (check == undefined) {
            export_emoji_map.set(stemmed_word, adding_values)
        } else {
            // add original to the map
            check.forEach(emoji => {
                export_emoji_map = addEmojiToNewMap(export_emoji_map, stemmed_word, emoji);
            })
            // add adding_values to the map
            adding_values.forEach(emoji => {
                export_emoji_map = addEmojiToNewMap(export_emoji_map, stemmed_word, emoji);
            })
        }
    })

    return export_emoji_map
}

function findExportFileName() {
    const file_data : Readonly<Config> = readFromData('config');
    const base_directory = __dirname.replace('emojiProcessing', 'data');
    return path.join(base_directory, file_data.export_file_name + '.json')
}

function addEmojiToNewMap(map : EmojiMap, key : string, emoji : MapEmoji) {
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
    return map
}