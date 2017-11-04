import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import {MinuteBuckets} from "../MinuteBuckets";

const window = 10; // seconds

export class Rate extends Aggregator {
	private twitter = new MinuteBuckets<boolean>(window * 1000);
    private reddit = new MinuteBuckets<boolean>(window * 1000);

	_process(post: Post) {
		if (post.source === "Twitter") {
            this.twitter.push(new Date, true);
        } else {
            this.reddit.push(new Date, true);
        }
	}

	calc() {
		let tw_count = 0;
		this.twitter.forEach(val => {
			tw_count++;
		});

        let r_count = 0;
        this.reddit.forEach(val => {
            r_count++;
        });

		return {twitter: tw_count / window, reddit: r_count / window, total: (tw_count + r_count) / window};
	}

}