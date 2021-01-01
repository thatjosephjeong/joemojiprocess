import { readFromData } from "../data/read-data";
import { createNewKeywordsTable } from "../pg/pg";
import { EmojiImport } from "./ingest-interface";

export async function buildOriginalSQLDatabase() {
    // read in emojiJSON and create a new keywords table at the same time
    // only returns the read emoji though
    const emoji_import = (await Promise.all([readEmojiJSON(), createNewKeywordsTable()]))[0];
    console.log(emoji_import);



    // Object.keys(emoji_import).forEach((key) => {

    // })

}

async function readEmojiJSON() : Promise<Readonly<EmojiImport>> {
    // synchronously ingests the entire file
    return readFromData('emoji')
}

buildOriginalSQLDatabase()