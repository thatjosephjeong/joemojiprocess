// This file contains every interaction with the SQL database
import { Pool } from "pg";
import { readFromData } from "../data/read-data";
import { PGConfig } from "./pg-interface";

//create a new pool
const pg_config : Readonly<PGConfig> = readFromData('pg-config');

const pool = new Pool(pg_config.server_details);
const table_name = pg_config.table_name;

export async function createNewKeywordsTable() : Promise<void> {
    // function below is only needed if IF EXISTS doesn't work
    // const check = await checkIfTableExists(ingestPGConfig().table_name);
    // if (check == true) {
    // }


    // delete the table if it exists
    await deleteTableIfExists();
    await createNewTable();
}

// async function checkIfTableExists(table_name : string) : Promise<boolean> {
//     /* 
//     Result {
//         command: 'SELECT',
//         rowCount: 1,
//         oid: null,
//         rows: [ { to_regclass: 'test' } ], < -------
//         Rows[0].to_regclass will return null if the table does not exist
//         fields: [
//             Field {
//             name: 'to_regclass',
//             tableID: 0,
//             columnID: 0,
//             dataTypeID: 2205,
//             dataTypeSize: 4,
//             dataTypeModifier: -1,
//             format: 'text'
//             }
//         ],
//         _parsers: [ [Function: noParse] ],
//         _types: TypeOverrides {
//             _types: {
//             getTypeParser: [Function: getTypeParser],
//             setTypeParser: [Function: setTypeParser],
//             arrayParser: [Object],
//             builtins: [Object]
//             },
//             text: {},
//             binary: {}
//         },
//         RowCtor: null,
//         rowAsArray: false
//     }
//     */
//     try {
//         // check if the table exists
//         const check = await pool.query("SELECT to_regclass($1);", [table_name]);
//         return check.rows[0].to_regclass != null;
//     } catch (err) {
//         // if there is a server error, assume the table already does exist
//         console.log(err);
//         return true;
//     }
// }

async function deleteTableIfExists() : Promise<void> {
    // inserted into the query string as pool.query doesn't support
    // variable table names
    await pool.query(`DROP TABLE IF EXISTS ${table_name}`);
}

async function createNewTable() : Promise<void> {
    // inserted into the query string as pool.query doesn't support
    // variable table names
    const query_string = `
        CREATE TABLE ${table_name} (
            keyword text PRIMARY KEY,
            emoji_array char(1)[],
            weighting_array integer[]
        )
    `
    await pool.query(query_string);
}

export async function insertEmojiIntoTable(keyword : string, emoji : string, weighting : number) : Promise<void> {
    /*
    Here is what the query string is trying to do:
    IF the keyword is in the table,
        THEN IF the emoji IS NOT already in the emoji_array
            UPDATE the entry by:
            APPEND the emoji to the END of the emoji_array
            APPEND the weight to the END of the weighting_array
    ELSE
        INSERT the keyword with the emoji and weight
    */
    const query_string = `
        DO $$                  
        BEGIN 
        IF EXISTS
            ( SELECT 1
            FROM   ${table_name}
            WHERE  keyword = '${keyword}'
            )
        THEN
            IF NOT EXISTS
                ( SELECT 1
                FROM ${table_name}
                WHERE keyword = '${keyword}'
                AND '${emoji}' = ANY(emoji_array)
                )
            THEN
                UPDATE ${table_name}
                SET emoji_array = emoji_array || '{"${emoji}"}',
                    weighting_array = weighting_array || '{${weighting}}'
                WHERE keyword = '${keyword}';
            END IF;
        ELSE
            INSERT INTO ${table_name}
            VALUES (
                '${keyword}',
                '{"${emoji}"}',
                '{${weighting}}'
            );
        END IF;
        END $$;
    `
    // technically, this implementation is not very safe
    // but since this doens't talk with the outside world or 
    // unpredictable apis, SQL Injection probs ain't gonna happen
    await pool.query(query_string);
}