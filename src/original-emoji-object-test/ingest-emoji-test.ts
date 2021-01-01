// not using a testing framework, just a playground for myself

import { createNewKeywordsTable, insertEmojiIntoRawTable } from "../pg/pg";

async function insertEmojiIntoTableTest() {
    await createNewKeywordsTable();
    insertEmojiIntoRawTable('hello', 'c', 50);
    insertEmojiIntoRawTable('hello', 'd', 50);
    insertEmojiIntoRawTable('hello', 'c', 50);
    insertEmojiIntoRawTable('hello', 'e', 60);
    insertEmojiIntoRawTable('hello', 'c', 50);
    insertEmojiIntoRawTable('kok', 'c', 50);
}

insertEmojiIntoTableTest();