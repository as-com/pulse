require('dotenv').config();

import {RedditIngest} from "./ingesters/RedditIngest";
import {TwitterIngest} from "./ingesters/TwitterIngest";
import {Ingester, Post} from "./Ingester";
import SortedSet = require("collections/sorted-set");

const ingesters: Ingester[] = [
	new RedditIngest(),
	new TwitterIngest(),
];

const recentPosts: SortedSet<Post> = new SortedSet([], function postEquals(a: Post, b: Post) {
	return a === b;
	// return a.time.getTime() === b.time.getTime();
}, function postCompare(a: Post, b: Post) {
	return a.time.getTime() - b.time.getTime();
});

setInterval(function () {
	try {
		const cutoff = Date.now() - 60000;
		while (true) {
			const least = recentPosts.findLeast();
			if (least["value"].time.getTime() < cutoff) {
				recentPosts.remove(least["value"]);
			} else {
				break;
			}
		}

		console.log(recentPosts["length"]);
	} catch (e) {

	}
}, 500);

function processPost(post: Post) {
	// extract words
	const words = post.message.match(/\b(\w+)\b/g).map(x => x.toLowerCase());
}

function processPosts(posts: Post[]) {
	posts.forEach(processPost);

	recentPosts.addEach(posts);
}

ingesters.map(i => i.on("post", processPosts));