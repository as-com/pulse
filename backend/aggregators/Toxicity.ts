import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import * as _ from 'lodash';
import got = require("got");
import {MinuteBuckets} from "../MinuteBuckets";

const PERSPECTIVE_API_KEY = process.env["PERSPECTIVE_API_KEY"];

export class Toxicity extends Aggregator {
	private buckets = new MinuteBuckets<number>(20000);

	private request = _.throttle(async (message: string) => {
		try {
			const response: any = await got.post(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`, {
				json: true,
				body: {
					comment: message,
					requestedAttributes: {
						TOXICITY: {}
					},
					doNotStore: true
				}
			});

			console.log(message, response.attributeScores.TOXICITY.summaryScore.value);

			this.buckets.push(new Date(), response.attributeScores.TOXICITY.summaryScore.value);
		} catch (e) {
			// ???
		}
	}, 105);

	_process(post: Post) {
		this.request(post.message);
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