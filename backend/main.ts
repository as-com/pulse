import {Emoji} from "./aggregators/Emoji";

require('dotenv').config();

import {Aggregator} from "./Aggregator";

import {RedditIngest} from "./ingesters/RedditIngest";
import {TwitterIngest} from "./ingesters/TwitterIngest";
import {Ingester, Post} from "./Ingester";
import SortedSet = require("collections/sorted-set");
import * as io from "socket.io";
import {Words} from './aggregators/Words';
import * as http from "http";
import {Sentiment} from "./aggregators/Sentiment";
import {Toxicity} from "./aggregators/Toxicity";
import {Rate} from "./aggregators/Rate";
import {Stream} from "./aggregators/Stream";
import {Hashtags} from "./aggregators/Hashtags";
import {Mentions} from "./aggregators/Mentions";

const httpServer = http.createServer();
httpServer.listen(3000);
const server = io.listen(httpServer);

function metaBroadcast(event: string) {
	return function broadcast(obj) {
		server.emit(event, obj);
	}
}

const ingesters: Ingester[] = [
	new RedditIngest(),
	new TwitterIngest(),
];

const aggregators: Aggregator[] = [
	new Words(metaBroadcast("words")),
    new Emoji(metaBroadcast("emoji")),
	new Sentiment(metaBroadcast("sentiment")),
	new Rate(metaBroadcast("rate")),
	new Toxicity(metaBroadcast("toxicity")),
	new Stream(metaBroadcast("stream")),
	new Hashtags(metaBroadcast("hashtags")),
	new Mentions(metaBroadcast("mentions"))
];

function processPost(post: Post) {
	aggregators.forEach(a => a.process(post));
}

function processPosts(posts: Post[]) {
	posts.forEach(processPost);
}

ingesters.map(i => i.on("post", processPosts));