export interface PGConfig {
    server_details: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number
    }
    table_name: string
}