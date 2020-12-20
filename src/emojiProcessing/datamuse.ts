import { readFromData } from "../data/read_from_data";
import { Config } from "../interfaces/config_interface";
import { EmojiMap } from "../interfaces/emojis_interfaces";

export function sliceMapByUlimit(map : EmojiMap) : EmojiMap[] {
    // return an array of keywords attached to emojis
    // can be optomised by calling sendRequestsUnderUlimit within the loop but cbs
    // returns a double list of the keys in EmojiImport

    // wsl only allows 1024 requests at once
    const max_async_requests : number = readMaxUlimitFromConfig();
    console.log(max_async_requests)
    var emoji_list : EmojiMap[] = [];
    var tracker = max_async_requests + 1;
    // to start at 0
    var index = -1;

    for (const [key, value] of map.entries()) {
        if (tracker >= max_async_requests) {
            console.log(emoji_list[index]);
            index += 1;
            emoji_list[index] = new Map();
            tracker = 0;
        }
        emoji_list[index].set(key, value);
        tracker += 1;
        
      }

    return emoji_list;
}

function readMaxUlimitFromConfig() : number {
    const configFile : Config = readFromData('config')
    return configFile.max_ulimit;
}
