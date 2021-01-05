import { buildOriginalSQLDatabase } from "./original-emoji-object/ingest-emoji";
import { addRelatedWords } from "./datamuse/find-related-words";
import { askForQuestion } from "./original-emoji-object/question";

async function main() {

    const iterations = await askForQuestion(
`
Which iteration of the table is this??

0 - the original emoji.json,
any number above 1 will import
the previous postgresql raw-table

`   );
    
// only need to build the original rawtable if it doesn't already exist
    if (iterations == 0) {
        // build the original SQL database from emoji.json
        await buildOriginalSQLDatabase();
    } 

    // find related words and add them to the SQL Database
    // this includes creating the temp table
    await addRelatedWords(iterations);

    console.log("we done did it chief");
}

main();