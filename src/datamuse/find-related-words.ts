import { Result, Row } from "../pg/pg-interface";
import { createTempTable, paginatedTempTable } from "../pg/pg";
import { findRelatedWords } from "./datamuse";

export async function addRelatedWords() {
    // wait for a temp table to be created
    await createTempTable();

    // create a paginated temp table
    var temp_table = paginatedTempTable();
    var result : Result = (await temp_table.next()).value
    
    while (result.rowCount != 0) {

        var rows = result.rows;
        await workOnWords(rows);
        // get the next iteration
        result = (await temp_table.next()).value
    }
}

async function workOnWords(rows : Row[]) {
    const keyword_list = rows.map((obj) => {
        return obj.keyword
    })
    console.log(await findRelatedWords(keyword_list));
}