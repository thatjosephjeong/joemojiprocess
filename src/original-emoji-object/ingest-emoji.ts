import { normaliseInput } from "../word-processing/normalise";
import { readFromData } from "../data/read-data";
import { createNewKeywordsTable, insertEmojiIntoRawTable } from "../pg/pg";
import { EmojiImport } from "./ingest-interface";

export async function buildOriginalSQLDatabase() {
    // read in emojiJSON and create a new keywords table at the same time
    // only returns the read emoji though
    const emoji_import = (await Promise.all([readEmojiJSON(), createNewKeywordsTable()]))[0];

    // insert the original keywords into the SQL database
    await insertOriginalKeywords(emoji_import);
}

async function insertOriginalKeywords(emoji_import : EmojiImport) : Promise<void> {
    // insert the original keywords into the raw table

    const object_keys = Object.keys(emoji_import);

    for (let key in Object.keys(emoji_import)) {
        // normalise the original input
        const words = emoji_import[object_keys[key]].keywords.map((word) => normaliseInput(word)).flat(2);
        for (let keyword in words) {
            // insert every keyword into the table
            await insertEmojiIntoRawTable(words[keyword], emoji_import[object_keys[key]].char, 
                2000, emoji_import[object_keys[key]].fitzpatrick_scale);
        }
    }
}

async function readEmojiJSON() : Promise<Readonly<EmojiImport>> {
    // synchronously ingests the entire file
    return readFromData('emoji')
}
