import { findRelatedWordsList } from "./emojiProcessing/datamuse";
import { ingestEmojisAsMap } from "./emojiProcessing/ingest";
import { EmojiMap } from "./interfaces/ingest_interfaces";


async function main() {
    // import the original JSON file in a map format
    const original_emojis_map : Readonly<EmojiMap> = ingestEmojisAsMap();
    console.log(original_emojis_map);
    const new_emoji_map = await findRelatedWordsList(original_emojis_map)
    console.log(new_emoji_map)

    // add_to_new_map( modify_emoji_objects( find_related_words( slice_keywords( original_emojis_map.keys())))

}

main()