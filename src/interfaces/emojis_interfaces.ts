export interface EmojiImport{
    [key: string]: Emoji    
}

export interface Emoji {
    keywords: string[],
    char: string,
    fitzpatrick_scale: boolean,
    category: string
}

export interface MapEmoji {
    char: string,
    fitzpatrick_scale: boolean,
    weight: number
}

export interface DataMuseEmoji {
    keywords: string[][],
    char: string,
    fitzpatrick_scale: boolean,
    category: string
}

export type EmojiMap = Map<string, MapEmoji[]> 

export interface Word {
    word: string, 
    score: number
}

export interface WordsObj {
    [key: string]: Word[]
}

/*
    Map of keywords that stores emoji words?
*/