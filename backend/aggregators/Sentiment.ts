import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import * as sentiment from "sentiment";
import {MinuteBuckets} from "../MinuteBuckets";

export class Sentiment extends Aggregator {
	private buckets = new MinuteBuckets<number>();

	_process(post: Post) {
		const sent = sentiment(post.message);
		this.buckets.push(new Date(), sent.score);
	}

	calc() {
		let total = 0;
		let count = 0;
		this.buckets.forEach(val => {
			total += val;
			count++;
		});

		return {average: total / count};
	}
}