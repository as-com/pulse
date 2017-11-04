import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();
import * as _ from "lodash";

export class Hashtags extends Aggregator {
	hashtag_buckets = new MinuteBuckets<string>(15000);

	_process(post: Post) {
		const date = new Date();
		_.uniq(post.hashtags).forEach(w => this.hashtag_buckets.push(date, w));
	}

	calc() {
		const freq = new Map<string, number>();
		this.hashtag_buckets.forEach(function (hashtag) {
			if (freq.has(hashtag)) {
				freq.set(hashtag, freq.get(hashtag) + 1);
			} else {
				freq.set(hashtag, 1);
			}
		});

		const entries = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);

		return entries.slice(0, 8);
	}

}