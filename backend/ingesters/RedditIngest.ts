import {EventEmitter} from "events";
import {Ingester, Post} from "../Ingester";
import * as snoowrap from "snoowrap";
import Comment from "snoowrap/dist/objects/Comment";

function toPosts(c: Comment): Post {
	return {
		message: c.body,
		poster: c.author.name,
		time: new Date(c.created_utc),
		hashtags: [],
		mentions: [], // TODO
		source: "Reddit"
	}
}

export class RedditIngest extends EventEmitter implements Ingester {
	r = new snoowrap(<any>{
		userAgent: "server:com.andrewsun.pulse:v0.1 (by /u/as-com)",
		clientId: process.env["REDDIT_CLIENT_ID"],
		clientSecret: process.env["REDDIT_SECRET"],
		username: process.env["REDDIT_USER"],
		password: process.env["REDDIT_PASS"],
		requestDelay: 1010,
		maxRetryAttempts: 5,
		retryErrorCodes: [500, 502, 503, 504, 522, 521, 520, 524, 523],
		continueAfterRatelimitError: true
	});

	constructor() {
		super();

		this.init();
	}

	private ptr: string;

	private async init() {
		try {
			const comments = await this.r.getNewComments("all", <any>{ limit: 100 });
			this.ptr = comments[comments.length - 2].id;

			this.emit("post", comments.map(toPosts));

			this.loop();
		} catch (e) {
			console.error(e);
		}
	}

	private async loop() {
		const listing = await this.r.getNewComments("all", <any>{ limit: 100, before: `t1_${this.ptr}` });
		console.log(`Fetched ${listing.length} Reddit comments`);

		this.emit("post", listing.slice(0, listing.length - 1).map(toPosts));

		if (listing.length > 1) {
			this.ptr = listing[1].id;
		}

		setTimeout(() => {
			this.loop();
		}, 350);
	}


}