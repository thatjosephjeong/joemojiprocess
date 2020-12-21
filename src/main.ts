import { findRelatedWordsList } from "./emojiProcessing/datamuse";
import { exportMapToJSONObject } from "./emojiProcessing/export";
import { ingestEmojisAsMap } from "./emojiProcessing/ingest";
import { EmojiMap } from "./interfaces/ingest_interfaces";
import { addRelatedWordsToMap } from "./map/recursive_map";


async function main() {
    // import the original JSON file in a map format
    const original_emojis_map : EmojiMap = ingestEmojisAsMap();

    // find related words from datamuse
    const new_emoji_list = await findRelatedWordsList(original_emojis_map)

    // add related words to a new map
    const new_emoji_map = await addRelatedWordsToMap(new_emoji_list, original_emojis_map);

    exportMapToJSONObject(new_emoji_map);   
}

main()