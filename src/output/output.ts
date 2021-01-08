import { createNewOutputTable, createTempTable, deleteTempTable, paginatedTempTable, insertEmojiIntoOutputTable, findTempOriginalWords } from "../pg/pg";
import { Result, Row } from "../pg/pg-interface";
import { stemWord } from "../word-processing/natural";

export async function exportToOutputTable(iterations : number) {
    // create a new output table
    await createNewOutputTable(iterations);
    await createTempTable(iterations);

    // create a paginated output table
    // whilst the iteration is arbitary, am just doing it with increment
    var temp_table = paginatedTempTable();
    var result : Result = (await temp_table.next()).value
    console.log(result);

    while (result.rowCount != 0) {

        var rows = result.rows;
        await stemWordsAndAddToOuput(rows, iterations);
        // get the next iteration
        result = (await temp_table.next()).value
    }

    await deleteTempTable();
}

async function stemWordsAndAddToOuput(rows : Row[], iterations : number) {
    const stemmed_words = rows.map((obj) => {
        return stemWord(obj.keyword);
    });

    await insertStemmedWords(stemmed_words, rows, iterations);
}

async function insertStemmedWords( stemmed_words : string[], original_rows : Row[], iterations : number) : Promise<null> {
    // a large amount of nested functions but tbh, this is the clearest way to lay it out

    for (let i in stemmed_words) {
        // get the original word
        const original_word = original_rows[i].keyword;
        const stemmed_word = stemmed_words[i];

        const related_rows = await findTempOriginalWords(original_word)

        // insert the new row into the raw table
        await insertRowArrayIntoOutputTable(related_rows, stemmed_word, iterations);
    }

    return null;
}

async function insertRowArrayIntoOutputTable(rows_updated_weighting : Row[] , related_word : string, iterations : number) : Promise<null> {
    // insert cleaned words into the SQL Raw Table
    for (let n in rows_updated_weighting) {
        // get a position in the array
        const updated_row = rows_updated_weighting[n];
        for (let m in updated_row.emoji_array) {
                // finally, insert all the emoji into the raw table
            await insertEmojiIntoOutputTable(
                related_word, 
                updated_row.emoji_array[m], 
                updated_row.weighting_array[m], 
                updated_row.fitzpatrick_scale_array[m],
                iterations
            )
        }
    }

    return null;
}