import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";
import * as _ from "lodash";

export class Mentions extends Aggregator {
	buckets = new MinuteBuckets<string>(15000);

	_process(post: Post) {
		const date = new Date();
		_.uniq(post.mentions).forEach(w => this.buckets.push(date, w));
	}

	calc() {
		const freq = new Map<string, number>();
		this.buckets.forEach(function (mention) {
			if (freq.has(mention)) {
				freq.set(mention, freq.get(mention) + 1);
			} else {
				freq.set(mention, 1);
			}
		});

		const entries = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);

		return entries.slice(0, 8);
	}

}