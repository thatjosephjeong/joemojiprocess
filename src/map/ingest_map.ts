import { EmojiMap } from "src/interfaces/ingest_interfaces";
import { readFromData } from "../data/read_from_data";
import { Config } from "../interfaces/config_interface";
import { ExportObject } from "../interfaces/export_interfaces";

export function ingestPreviousExport() : EmojiMap {
    const input_object : ExportObject = readFromData(findExportFileName());

    const new_map : EmojiMap = new Map(Object.entries(input_object));

    return new_map;
}

export function findExportFileName() {
    const file_data : Readonly<Config> = readFromData('config');
    return file_data.raw_export_file_name;
}