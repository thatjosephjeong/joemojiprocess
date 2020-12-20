import { ReturnedRequest, Word } from "src/interfaces/datamuse_interfaces";
import { EmojiMap, MapEmoji } from "src/interfaces/ingest_interfaces";
import { RelatedEmoji } from "src/interfaces/map_interfaces";

export async function hello(returned_requests : readonly ReturnedRequest[], original_map : EmojiMap) {
    const related_emojis = returned_requests.map(returned_request => modify_emoji_objects(returned_request, original_map));
    
    var new_map = new Map(original_map);
    
    related_emojis.map(related_emoji => {
        related_emoji.related_words.map(related_word => {
            new_map = addEmojiToKey(new_map, related_emoji.emoji_list, related_word)
        })
    })

    return new_map;
}

function addEmojiToKey(map : EmojiMap, related_emojis : MapEmoji[], related_word : Word){

    console.log('adding ', related_word.word, ' to the new map');

    var new_map = map;

    const weighted_related_emojis = related_emojis.map(related_emoji => {
    const return_emoji : MapEmoji = {
        char: related_emoji.char,
        fitzpatrick_scale: related_emoji.fitzpatrick_scale,
        weight: related_word.score
    }
    return return_emoji;
    })

    const check = map.get(related_word.word);
    if (check == undefined) {
        new_map.set(related_word.word, weighted_related_emojis);
    } else {
        let new_emoji_array : MapEmoji[] = []
        // firstly make sure the new emoji are chucked in
        check.map(emoji => new_emoji_array.push(emoji));

        weighted_related_emojis.map(weighted_related_emoji => {
            let face_array = new_emoji_array.map(emoji => emoji.char);
            if (face_array.indexOf(weighted_related_emoji.char) < 0) {
                new_emoji_array.push(weighted_related_emoji);
            } 
        })

        new_map.set(related_word.word, new_emoji_array);
    }
    return new_map
}

function definedGet(i : string, map : EmojiMap) : MapEmoji[] {
    let words = map.get(i);
    if (words != undefined) {
        return words
    }
    // if it isn't a defined get
    return []
}

function modify_emoji_objects(returned_request : ReturnedRequest, original_map : EmojiMap) : Readonly<RelatedEmoji> {
    const map_emojis = definedGet(returned_request.original_word, original_map);
    return {
        emoji_list: map_emojis,
        related_words: returned_request.related_words
    }
}