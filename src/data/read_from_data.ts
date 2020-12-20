import * as fs from 'fs';
import * as path from 'path';

export function readFromData(fileName : string){
    // returns JSON object stored in data folder
    const data : string = fs.readFileSync(path.join(__dirname, fileName + '.json'), {encoding:'utf8'});
    const object = JSON.parse(data);
    return object;
}