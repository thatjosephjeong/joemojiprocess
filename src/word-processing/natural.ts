import * as natural from "natural"

export function stemWord (word : string) {
    const stemmed_word =  natural.PorterStemmer.stem(word);
    console.log(`stemmed ${word} to ${stemmed_word}`);
    return stemmed_word;
}

export function tokeniseString(input : string) : string[] {
    const tokeniser = new natural.WordTokenizer();
    return tokeniser.tokenize(input);
}