
import { ingestEmojisAsMap } from "./emojiProcessing/ingest";
import { EmojiMap } from "./interfaces/emojis_interfaces";
import {sliceMapByUlimit} from "./emojiProcessing/datamuse"

function main() {
    // import the original JSON file in a map format
    var emojis_map : EmojiMap = ingestEmojisAsMap();

    console.log(sliceMapByUlimit(emojis_map).length);

    // return emojis_map;

    /*
    // add the emoji to the map
    addEmojiToMap(
        // weight the related emoji of the keywords
        weightRelatedEmojis(
            //find related words to the keys of the map
            findRelatedWords(
                // find the related keywords 
                findKeysToMap(emojisMap) 
            )
        )
    )
    */

}



console.log(main())
