import { buildOriginalSQLDatabase } from "./original-emoji-object/ingest-emoji";
import { addRelatedWords } from "./datamuse/find-related-words"

async function main() {
    // build the original SQL database from emoji.json
    await buildOriginalSQLDatabase();

    // find related words and add them to the SQL Database
    await addRelatedWords();

    console.log("we done did it chief");
}

main();