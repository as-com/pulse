import {Aggregator} from "./Aggregator";

require('dotenv').config();

import {RedditIngest} from "./ingesters/RedditIngest";
import {TwitterIngest} from "./ingesters/TwitterIngest";
import {Ingester, Post} from "./Ingester";
import SortedSet = require("collections/sorted-set");
import * as io from "socket.io";
import {Words} from './aggregators/Words';

const server = io(3000);

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
	new Words(metaBroadcast("words"))
];

function processPost(post: Post) {
	aggregators.forEach(a => a.process(post));
}

function processPosts(posts: Post[]) {
	posts.forEach(processPost);
}

ingesters.map(i => i.on("post", processPosts));