import {Ingester, Post} from "../Ingester";
import {EventEmitter} from 'events';
import {Stream} from "stream";
import {isObject, isString} from "util";
import fs = require('fs');
import * as ReadLine from "readline";

var Twitter = require('twitter-enhanced');

var client = new Twitter({
    consumer_key: process.env["TWITTER_CONSUMER_KEY"],
    consumer_secret: process.env["TWITTER_CONSUMER_SECRET"],
    access_token_key: process.env["TWITTER_ACCESS_TOKEN_KEY"],
    access_token_secret: process.env["TWITTER_ACCESS_TOKEN_SECRET"]
});
// console.log(client)

let users: string = (<string> fs.readFileSync('ingesters/twitter-5000.txt', 'utf8')).split('\n').join(',');
// let users: string = "21447363,27260086";
// console.log(users);

export class TwitterIngest extends EventEmitter implements Ingester {
    twstream: Stream;

    constructor() {
        super();
        this.establish_stream();
    }

    establish_stream() {
        console.log("twitter establish_stream");
        var that = this;

        const request = client.request;
        const rl = ReadLine.createInterface({
            input: request.post({
                uri: "https://stream.twitter.com/1.1/statuses/filter.json",
                form: {
                    follow: users
                }
            })
        });

	    rl.on("line", line => {
	        // console.log(line);
		    const event = JSON.parse(line);
		    this.process_data(event);
	    });

	    rl.on("close", function(error) {
		    console.error(error);
		    // throw error;
		    that.establish_stream();
	    });
    }

    process_data(event) {
        // console.log("twitter process_data");
        if (!isObject(event['user'])) {
            return;
        }
        // console.log("A user");
        if (!isString(event['id_str'])) {
            return;
        }
        // console.log("B id");
        if (!isString(event['text'])) {
            return;
        }
        // console.log("C text");
        // if ('retweeted_status' in event) {
        //     console.log("filtering retweet");
        //     return;
        // }
        // console.log(event);
        // console.log(event['entities']);

        let post: Post = {
            message: <string> event['text'],
            time: new Date(event['created_at']),
            hashtags: event['entities']['hashtags'].map(function (x) {
                return x['text'];
            }),
            mentions: event['entities']['user_mentions'].map(function (x) {
                return x['screen_name'];
            }),
            source: "Twitter",
        };
        this.emit("post", [post]);
    }

}
