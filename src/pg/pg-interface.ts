export interface PGConfig {
    server_details: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number
    }
    output_table_name: string,
    raw_table_name: string,
    temp_table_name: string
}

export interface Row {
    keyword: string,
    emoji_array: string[],
    weighting_array: number[],
    fitzpatrick_scale_array: boolean[]
}

export interface Field {
    name: string,
    tableID: number,
    columnID: number,
    dataTypeID: number,
    dataTypeSize: number,
    dataTypeModifier: number,
    format: string
}
export interface Result {
    command: string,
    rowCount: number,
    oid: null,
    rows: Row[],
    fields: Field[],
    _parsers: any[],
    _types: any,
    RowCtor: null,
    rowAsArray: boolean
}
