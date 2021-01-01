// not using a testing framework, just a playground for myself

import { createNewKeywordsTable, insertEmojiIntoTable } from "../pg/pg";

async function insertEmojiIntoTableTest() {
    await createNewKeywordsTable();
    insertEmojiIntoTable('hello', 'c', 50);
    insertEmojiIntoTable('hello', 'd', 50);
    insertEmojiIntoTable('hello', 'c', 50);
    insertEmojiIntoTable('hello', 'e', 60);
    insertEmojiIntoTable('hello', 'c', 50);
    insertEmojiIntoTable('kok', 'c', 50);
}

insertEmojiIntoTableTest();