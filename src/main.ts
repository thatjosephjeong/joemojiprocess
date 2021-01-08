import { buildOriginalSQLDatabase } from "./original-emoji-object/ingest-emoji";
import { addRelatedWords } from "./datamuse/find-related-words";
import { askForQuestion } from "./original-emoji-object/question";
import { createNewRawTable } from "./pg/pg";
import { exportToOutputTable } from "./output/output";

async function main() {

    const iterations = await askForQuestion(
`
Which iteration of the table is this??

-1 convert a rawemoji table into raw output
0 - the original emoji.json,
any number above 1 will import
the previous postgresql raw-table

`   );
    
// only need to build the original rawtable if it doesn't already exist
    if (iterations == 0) {
        // build the original SQL database from emoji.json
        await buildOriginalSQLDatabase(iterations);
        
        // find related words and add them to the SQL Database
        // this includes creating the temp table
        await addRelatedWords(iterations, iterations);
    } else if (iterations == -1) {
        const table_num = await askForQuestion('which rawemoji table?');
        await exportToOutputTable(table_num);
    } else {
        // creates a new raw table
        await createNewRawTable(iterations);

        await addRelatedWords(iterations - 1, iterations);
    }

    

    console.log("we done did it chief");
}

main();