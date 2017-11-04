import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";

export class Rate extends Aggregator {
	private buckets = new MinuteBuckets<boolean>(10000);
	_process(post: Post) {
		this.buckets.push(new Date, true);
	}

	calc() {
		let count = 0;
		this.buckets.forEach(val => {
			count++;
		});

		return {rate: count / 10};
	}

}