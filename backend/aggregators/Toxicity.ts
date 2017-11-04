import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import * as _ from 'lodash';
import got = require("got");
import {MinuteBuckets} from "../MinuteBuckets";

const PERSPECTIVE_API_KEY = process.env["PERSPECTIVE_API_KEY"];

export class Toxicity extends Aggregator {
	private buckets = new MinuteBuckets<number>(20000);

	private buffer: string[] = [];
	private request = _.throttle(async () => {
		const message = this.buffer[Math.floor(Math.random() * this.buffer.length)];
		this.buffer = [];
		try {
			const response: any = await got.post(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`, {
				json: true,
				body: {
					comment: {text: message},
					requestedAttributes: {
						TOXICITY: {}
					},
					doNotStore: true
				}
			});

			// console.log(message, response.body.attributeScores.TOXICITY.summaryScore.value);

			this.buckets.push(new Date(), response.body.attributeScores.TOXICITY.summaryScore.value);
		} catch (e) {
			// console.log(e);
			// ???
		}
	}, 105);

	_process(post: Post) {
		this.buffer.push(post.message);
		this.request();
	}

	calc() {
		let total = 0;
		let count = 0;
		this.buckets.forEach(val => {
			total += val;
			count++;
		});

		return {toxicity: total / count};
	}

}