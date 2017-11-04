import {RedditIngest} from "./ingesters/RedditIngest";
import {Ingester, Post} from "./Ingester";

require('dotenv').config();

const ingesters: Ingester[] = [
	new RedditIngest()
];




function processPost(post: Post) {
	// extract words
	const words = post.message.match(/\b(\w+)\b/g).map(x => x.toLowerCase());

}

function processPosts(posts: Post[]) {
	posts.forEach(processPost);
}

ingesters.map(i => i.on("post", processPosts));