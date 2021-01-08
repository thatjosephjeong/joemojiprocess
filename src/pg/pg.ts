// This file contains every interaction with the SQL database
import { Pool, QueryResult } from "pg";
import { readFromData } from "../data/read-data";
import { PGConfig, Result, Row } from "./pg-interface";
import * as pgformat from "pg-format";
import { IncrementConfig } from "../datamuse/datamuse-interface";

//create a new pool
const pg_config : Readonly<PGConfig> = readFromData('pg-config');

const pool = new Pool(pg_config.server_details);
const raw_table_name = pg_config.raw_table_name;
const temp_table_name = pg_config.temp_table_name;
const output_table_name = pg_config.output_table_name;

const ulimit_config : Readonly<IncrementConfig> = readFromData('increment-config');

export async function createNewRawTable(iterations : number) : Promise<void> {
    // create a new raw table
    await createNewTable(raw_table_name + iterations.toString());
    return;
}

export async function createNewOutputTable(iterations : number) : Promise<void> {
    await createNewTable(output_table_name + iterations.toString());
}

async function createNewTable(table_name : string) : Promise<void> {
    // inserted into the query string as pool.query doesn't support
    // variable table names
    await pool.query(`DROP TABLE IF EXISTS ${table_name};`);
    
    // inserted into the query string as pool.query doesn't support
    // variable table names
    const query_string = `
        CREATE TABLE ${table_name} (
            keyword text PRIMARY KEY,
            emoji_array text[],
            weighting_array integer[],
            fitzpatrick_scale_array boolean[]
        )
    `
    await pool.query(query_string);
    
    return;
}

export async function deleteTempTable() {
    await pool.query(`DROP TABLE IF EXISTS ${temp_table_name};`);
    return;
}

export async function insertEmojiIntoRawTable(keyword : string, emoji : string, weighting : number, fitzpatrick_scale : boolean, iterations : number) : Promise<null> {
    return await insertEmojiIntoTable(raw_table_name, keyword, emoji, weighting, fitzpatrick_scale, iterations)
}

export async function insertEmojiIntoOutputTable(keyword : string, emoji : string, weighting : number, fitzpatrick_scale : boolean, iterations : number) : Promise<null> {
    return await insertEmojiIntoTable(output_table_name, keyword, emoji, weighting, fitzpatrick_scale, iterations)
}

async function insertEmojiIntoTable(table_name : string, keyword : string, emoji : string, weighting : number, fitzpatrick_scale : boolean, iterations : number) : Promise<null> {
    /*
    Here is what the query string is trying to do:
    IF the keyword is in the table,
        THEN IF the emoji IS NOT already in the emoji_array
            UPDATE the entry by:
            APPEND the emoji to the END of the emoji_array
            APPEND the weight to the END of the weighting_array
            APPEND the fizpatrick_scale to the END of the fizpatrick_scale_array
    ELSE
        INSERT the keyword with the emoji and weight
    */
   var new_table_name = table_name;
    if (table_name != temp_table_name) {
        new_table_name = new_table_name + iterations.toString();
    }
   
    const query_string = `
        DO $$                  
        BEGIN 
        IF EXISTS
            ( SELECT *
            FROM   ${new_table_name}
            WHERE  keyword = %L
            )
        THEN
            IF NOT EXISTS
                ( SELECT 1
                FROM ${new_table_name}
                WHERE keyword = %L
                AND %L = ANY(emoji_array)
                )
            THEN
                UPDATE ${new_table_name}
                SET emoji_array = emoji_array || ARRAY[%L],
                    weighting_array = weighting_array || ARRAY[${weighting}],
                    fitzpatrick_scale_array = fitzpatrick_scale_array || ARRAY[${fitzpatrick_scale}]
                WHERE keyword = %L;
            END IF;
            RETURN;
        ELSE
            INSERT INTO ${new_table_name}
            VALUES (
                %L,
                ARRAY[%L],
                ARRAY[${weighting}],
                ARRAY[${fitzpatrick_scale}]
            );
        END IF;
        END $$;
    `
    // technically, this implementation is not very safe
    // but since this doens't talk with the outside world or 
    // unpredictable apis, SQL Injection probs ain't gonna happen

    // also PostgreSQL handles parameterized queries so shit its not even funny
    const query_array = [keyword, keyword, emoji, emoji, keyword, keyword, emoji];
    console.log(`adding ${emoji} to ${keyword} in SQL Server;`);
    await pool.query(pgformat.withArray(query_string, query_array));
    return null;
}

export async function createTempTable(iterations : number) {
    // createa a temp table and make sure temp table is dropped first
    await pool.query(`DROP TABLE IF EXISTS ${temp_table_name};`);

    const query_string = `
    CREATE TABLE ${temp_table_name} AS SELECT * FROM ${raw_table_name + iterations.toString()};
    `
    console.log(query_string);
    await pool.query(query_string);
}

export async function* paginatedTempTable() : AsyncGenerator< QueryResult<Result>, any, unknown> {
    var offset = 0;
    const query_string = `
        SELECT *
        FROM ${temp_table_name}
        ORDER BY keyword DESC
        LIMIT ${ulimit_config.ulimit_increment}
        OFFSET `

    while (true) {
        console.log(`Retrieving ${ulimit_config.ulimit_increment} results from ${temp_table_name}`);
        const reply = await pool.query(query_string + offset.toString() + ';');
        console.log(`Retried ${reply.rowCount} results from query`);
        yield reply;
        
        offset += ulimit_config.ulimit_increment;
    }
}

export async function findTempOriginalWords( keyword : string) : Promise<Row[]> {
    // find the current emojis in temptable
    const query_string = `
        SELECT *
        FROM ${temp_table_name}
        WHERE keyword = %L;
    `
    const query_array = [keyword];

    const word_store : QueryResult<any> =  await pool.query(pgformat.withArray(query_string, query_array));
    const rows : Row[] = word_store.rows;

    // technically this should only return one row, but let's be safe with it
    return rows;
}