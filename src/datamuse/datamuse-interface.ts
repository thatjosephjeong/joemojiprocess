export interface IncrementConfig {
    ulimit_increment: number
}

export interface ReturnedRequest {
    original_word: string,
    related_words: Word[]
}

export interface Word {
    word: string, 
    score: number
}