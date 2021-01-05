import { createNewOutputTable, paginatedTempTable } from "src/pg/pg";
import { Result } from "src/pg/pg-interface";

export async function exportToOutputTable() {
    // create a new output table
    await createNewOutputTable();

    // create a paginated output table
    // whilst the iteration is arbitary, am just doing it with increment
    var temp_table = paginatedTempTable();
    var result : Result = (await temp_table.next()).value
    console.log(result);
}