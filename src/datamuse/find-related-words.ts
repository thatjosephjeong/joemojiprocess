import { Result, Row } from "../pg/pg-interface";
import { createTempTable, deleteTempTable, findTempOriginalWords, insertEmojiIntoRawTable, paginatedTempTable } from "../pg/pg";
import { findRelatedWords } from "./datamuse";
import { ReturnedRequest, Word } from "./datamuse-interface";
import { normaliseInput } from "../word-processing/normalise";

export async function addRelatedWords(iterations : number) {
    // wait for a temp table to be created
    await createTempTable();

    // create a paginated temp table
    // this is to keep requests under the ulimit
    var temp_table = paginatedTempTable();
    var result : Result = (await temp_table.next()).value
    
    while (result.rowCount != 0) {

        var rows = result.rows;
        await findRelatedWordsAndAddThem(rows, iterations);
        // get the next iteration
        result = (await temp_table.next()).value

    }

    await deleteTempTable();
}

async function findRelatedWordsAndAddThem(rows : Row[], iterations : number) : Promise<void> {
    const keyword_list = rows.map((obj) => {
        return obj.keyword
    })
    // get returned requests of related words
    const related_words = await findRelatedWords(keyword_list);
    await insertRelatedWords(related_words, iterations);

}

async function insertRelatedWords( related_words : ReturnedRequest[] , iterations : number) : Promise<null> {
    // a large amount of nested functions but tbh, this is the clearest way to lay it out

    for (let i in related_words) {
        // get the original word
        const original_word = related_words[i].original_word;

        // get related words in the original table
        const related_rows = await findTempOriginalWords( original_word );

        for (let j in related_words[i].related_words) {
            const related_word_obj = related_words[i].related_words[j];

            // average all the weightings of the new emoji
            const rows_updated_weighting = updateWeightingsInRow(related_rows, related_word_obj);

            // insert the new row into the raw table
            await insertRowArrayIntoRawTable(rows_updated_weighting, related_word_obj, iterations);
        }
    }

    return null;
}

async function insertRowArrayIntoRawTable(rows_updated_weighting : Row[] , related_word_obj : Word, iterations : number) : Promise<null> {
    // insert cleaned words into the SQL Raw Table
    for (let n in rows_updated_weighting) {
        // get a position in the array
        const updated_row = rows_updated_weighting[n];
        for (let m in updated_row.emoji_array) {
            // normalise words returned from datamuse
            const clean_keywords = normaliseInput(related_word_obj.word);
            for (let i in clean_keywords) {
                // finally, insert all the emoji into the raw table
                await insertEmojiIntoRawTable(
                    clean_keywords[i], 
                    updated_row.emoji_array[m], 
                    updated_row.weighting_array[m], 
                    updated_row.fitzpatrick_scale_array[m],
                    iterations
                )
            }
        }
    }

    return null;
}

function updateWeightingsInRow(related_rows : Row[] , related_word_obj : Word) : Row[] {
    // update the weightings in each row with the average of two words
    return related_rows.map((row) => {
        const new_row_weightings =  row.weighting_array.map((weighting) => {
            // average the weighting for each row
            return average(weighting, related_word_obj.score - 500)
        })
        const new_row : Row = 
        {
            keyword: row.keyword,
            emoji_array: row.emoji_array,
            weighting_array: new_row_weightings,
            fitzpatrick_scale_array: row.fitzpatrick_scale_array
        }

        return new_row;
    })
}

function average (num1 : number, num2 : number) {
    return Math.round((num1 + num2) / 2);
}