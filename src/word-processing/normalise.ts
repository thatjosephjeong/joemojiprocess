import { tokeniseString } from "./natural";
import { removeDiacritics } from "./remove-diacritics";

export function normaliseInput(input: string) : string[] {
    // thats right, aussie spelling!
    return (tokeniseString( removeDiacritics( input.toLowerCase())).map((word) => separateOutWordsInPhrase(word))).flat(2)
}

function separateOutWordsInPhrase(phrase : string) : string[] {
    
    // splitting with regex keeps the delimiters so can't really use
    // /([-,_, ])/g

    const separated = ((phrase.split("_").map(x => x.split("-")).map(x => x.map(x => x.split(' ')))).flat(3));

    return separated;
}