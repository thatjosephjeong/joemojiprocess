import { findRelatedWordsList } from "./emojiProcessing/datamuse";
import { ingestEmojisAsMap } from "./emojiProcessing/ingest";
import { EmojiMap } from "./interfaces/ingest_interfaces";
import { hello } from "./map/recursive_map";


async function main() {
    // import the original JSON file in a map format
    const original_emojis_map : EmojiMap = ingestEmojisAsMap();
    console.log(original_emojis_map);
    const new_emoji_list = await findRelatedWordsList(original_emojis_map)
    console.log(new_emoji_list)
    const new_emoji_map = await hello(new_emoji_list, original_emojis_map);
    console.log(new_emoji_map)

    // add_to_new_map( modify_emoji_objects( find_related_words( slice_keywords( original_emojis_map.keys())))

}

main()