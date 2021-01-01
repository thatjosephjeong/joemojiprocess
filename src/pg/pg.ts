// This file contains every interaction with the SQL database
import { Pool } from "pg";
import { readFromData } from "../data/read-data";
import { PGConfig } from "./pg-interface";
import * as pgformat from "pg-format";

//create a new pool
const pg_config : Readonly<PGConfig> = readFromData('pg-config');

const pool = new Pool(pg_config.server_details);
const raw_table_name = pg_config.raw_table_name;

export async function createNewKeywordsTable() : Promise<void> {
    // function below is only needed if IF EXISTS doesn't work

    // delete the table if it exists
    await deleteTableIfExists();
    await createNewTable();
}

async function deleteTableIfExists() : Promise<void> {
    // inserted into the query string as pool.query doesn't support
    // variable table names
    await pool.query(`DROP TABLE IF EXISTS ${raw_table_name}`);
}

async function createNewTable() : Promise<void> {
    // inserted into the query string as pool.query doesn't support
    // variable table names
    const query_string = `
        CREATE TABLE ${raw_table_name} (
            keyword text PRIMARY KEY,
            emoji_array text[],
            weighting_array integer[]
        )
    `
    await pool.query(query_string);
}

export async function insertEmojiIntoRawTable(keyword : string, emoji : string, weighting : number) : Promise<null> {
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
            ( SELECT *
            FROM   ${raw_table_name}
            WHERE  keyword = %L
            )
        THEN
            IF NOT EXISTS
                ( SELECT 1
                FROM ${raw_table_name}
                WHERE keyword = %L
                AND %L = ANY(emoji_array)
                )
            THEN
                UPDATE ${raw_table_name}
                SET emoji_array = emoji_array || ARRAY[%L],
                    weighting_array = weighting_array || ARRAY[${weighting}]
                WHERE keyword = %L;
            END IF;
            RETURN;
        ELSE
            INSERT INTO ${raw_table_name}
            VALUES (
                %L,
                ARRAY[%L],
                ARRAY[${weighting}]
            );
        END IF;
        END $$;
    `
    // technically, this implementation is not very safe
    // but since this doens't talk with the outside world or 
    // unpredictable apis, SQL Injection probs ain't gonna happen

    // also PostgreSQL handles parameterized queries so shit its not even funny
    const query_array = [keyword, keyword, emoji, emoji, keyword, keyword, emoji];
    console.log(pgformat.withArray(query_string, query_array));
    await pool.query(pgformat.withArray(query_string, query_array));
    return null;
}