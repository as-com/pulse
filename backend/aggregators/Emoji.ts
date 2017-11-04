import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";
import { extractEmoji } from 'extract-emoji';


export class Emoji extends Aggregator {
    emoji_buckets = new MinuteBuckets<string>(10000);

    _process(post: Post) {
        const matches = extractEmoji(post.message);
        if (matches === null || matches.length == 0) {
            return;
        }
        const date = new Date();
        matches.forEach(w => this.emoji_buckets.push(date, w));
    }

    calc() {
        const freq = new Map<string, number>();
        this.emoji_buckets.forEach(function (emoji) {
            if (freq.has(emoji)) {
                freq.set(emoji, freq.get(emoji) + 1);
            } else {
                freq.set(emoji, 1);
            }
        });

        const entries = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);

        return entries.slice(0, 20);
    }

}