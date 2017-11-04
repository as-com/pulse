import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";
import * as _ from "lodash";

const blacklist = new Set(require("./word_blacklist.json").map(w => w.toLowerCase()));

export class Words extends Aggregator {
	buckets = new MinuteBuckets<string>(15000);

	_process(post: Post) {
		const matches = post.message.match(/\b(\w+)\b/g); // TODO: handle non-english
		if (matches === null) {
			return;
		}
		let exclude = post.mentions.concat(post.hashtags).map(w => w.toLowerCase());
		const words = matches.map(x => x.toLowerCase()).filter(w => {
			if (w.length <= 2) {
				return false;
			}
			// if (w === "kiwi") {
			// 	console.log(post);
			// }
			for (let i = 0; i < exclude.length; i++) {
				if (w === exclude[i])
					return false;
			}
			return !blacklist.has(w);
		});
		const date = new Date();
		_.uniq(words).forEach(w => this.buckets.push(/*post.time*/ date, w));
	}

	calc() {
		const freq = new Map<string, number>();
		this.buckets.forEach(function (word) {
			if (freq.has(word)) {
				freq.set(word, freq.get(word) + 1);
			} else {
				freq.set(word, 1);
			}
		});

		const entries = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);

		return entries.slice(0, 20);
	}

}