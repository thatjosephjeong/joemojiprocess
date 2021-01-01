import * as natural from "natural"

export function stemWord (word : string) {
    return natural.PorterStemmer.stem(word);
}

export function tokeniseString(input : string) : string[] {
    const tokeniser = new natural.WordTokenizer();
    return tokeniser.tokenize(input);
}