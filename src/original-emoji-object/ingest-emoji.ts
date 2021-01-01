import { readFromData } from "../data/read-data";
import { createNewKeywordsTable, insertEmojiIntoTable } from "../pg/pg";
import { EmojiImport } from "./ingest-interface";

export async function buildOriginalSQLDatabase() {
    // read in emojiJSON and create a new keywords table at the same time
    // only returns the read emoji though
    const emoji_import = (await Promise.all([readEmojiJSON(), createNewKeywordsTable()]))[0];

    // insert the original keywords into the SQL database
    insertOriginalKeywords(emoji_import);



    // Object.keys(emoji_import).forEach((key) => {

    // })

}

async function insertOriginalKeywords(emoji_import : EmojiImport) : Promise<void> {
    
    const object_keys = Object.keys(emoji_import);

    for (let key in Object.keys(emoji_import)) {
        for (let keyword in emoji_import[object_keys[key]].keywords) {
            console.log(keyword);
            await insertEmojiIntoTable(emoji_import[object_keys[key]].keywords[keyword], emoji_import[object_keys[key]].char, 2000);
        }
    }


    // Object.keys(emoji_import).forEach((key) => {
    //     emoji_import[key].keywords.forEach(async (keyword) => {
    //         await insertEmojiIntoTable(keyword, emoji_import[key].char, 2000);
    //     })
    // })

}

async function readEmojiJSON() : Promise<Readonly<EmojiImport>> {
    // synchronously ingests the entire file
    return readFromData('emoji')
}

buildOriginalSQLDatabase()