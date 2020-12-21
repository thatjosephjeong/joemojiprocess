import { Config } from "src/interfaces/config_interface";
import { readFromData } from "./read_from_data";

import * as readline from "readline";

function askQuestion(query : string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer : Promise<string> = new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    })) 
    return answer
}

async function main() {
    const config_file : Readonly<Config> = readFromData('config');
    const ulimit = await askQuestion('what ulimit would you like?\n');
    const new_config_file : Config = {
        max_ulimit: parseInt(ulimit), 
        export_file_name: config_file.export_file_name,
        raw_export_file_name: config_file.raw_export_file_name
    }
    return new_config_file
}




main()