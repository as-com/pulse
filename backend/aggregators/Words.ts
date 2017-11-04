import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";

export class Words extends Aggregator {
	buckets = new MinuteBuckets<string>();

	_process(post: Post) {
		const matches = post.message.match(/\b(\w+)\b/g); // TODO: handle non-english
		if (matches === null) {
			return;
		}
		const words = matches.map(x => x.toLowerCase());
		const date = new Date();
		words.forEach(w => this.buckets.push(/*post.time*/ date, w));
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

		return entries.slice(0, 10);
	}

}