import { Word } from "./datamuse_interfaces";
import { MapEmoji } from "./ingest_interfaces";

export interface RelatedEmoji {
    emoji_list: MapEmoji[],
    related_words: Word[]
}
