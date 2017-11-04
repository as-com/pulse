import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();
import * as _ from "lodash";

export class Emoji extends Aggregator {
    emoji_buckets = new MinuteBuckets<string>(15000);

    _process(post: Post) {
        const matches = post.message.match(regex);
        if (matches === null || matches.length == 0) {
            return;
        }
        const date = new Date();
        _.uniq(matches).forEach(w => this.emoji_buckets.push(date, w));
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

        return entries.slice(0, 18);
    }

}