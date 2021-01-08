export interface EmojiImport{
    [key: string]: Emoji    
}

export interface Emoji {
    keywords: string[],
    char: string,
    fitzpatrick_scale: boolean,
    category: string
}
