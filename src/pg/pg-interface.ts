export interface PGConfig {
    server_details: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number
    }
    output_table_name: string,
    raw_table_name: string
}