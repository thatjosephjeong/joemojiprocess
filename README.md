# joemojiprocess

THIS IS AN UNSTABLE BUILD

Make sure to create src/data/pg-config.json in this format:
{
    "server_details": {
        "host": "localhost",
        "database": "database",
        "user": "usename",
        "password": "password",
        "port": 5432
    },
    "output_table_name": "emojis",
    "raw_table_name": "rawEmojis",
    "temp_table_name": "tempEmojis"
}
PLEASE ENSURE that your table and database name is postgresql is happy to be overwritten