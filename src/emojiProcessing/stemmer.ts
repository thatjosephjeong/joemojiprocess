import * as natural from "natural"

export function stemWord (word : string) {
    return natural.PorterStemmer.stem(word);
}