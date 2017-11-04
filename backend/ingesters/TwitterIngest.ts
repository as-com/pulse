import {Ingester, Post} from "../Ingester";
import {EventEmitter} from 'events';
import {Stream} from "stream";
import {isNull, isObject, isString} from "util";
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
    private lock = false;

    constructor() {
        super();
        this.establish_stream();
    }

    establish_stream() {
        if (this.lock) {
            console.error("twitter locked, not establishing stream");
            return;
        }

        this.lock = true;

        console.log("twitter establish_stream");
        const that = this;

        const request = client.request;
        const stream = request.post({
	        uri: "https://stream.twitter.com/1.1/statuses/filter.json",
	        form: {
		        follow: users
	        }
        });
        const rl = ReadLine.createInterface({
            input: stream
        });

        let error = (e) => {
            this.lock = false;
            error = function () {};
            console.error(e);

            setTimeout(() => {
	            that.establish_stream();
            }, 5000);

            rl.close();
            stream.destroy();
        };

        stream.on("error", error);
        stream.on("finish", error);

	    rl.on("line", line => {
		    try {
			    const event = JSON.parse(line);
			    this.process_data(event);
            } catch (e) {
                error(e);
            }
	    });
	    // console.log(line);


	    rl.on("close", error);
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
        if ('lang' in event) {
            let lang = event['lang'];
            if (!isNull(lang) && !(lang === "en" || lang === "und")) {
                return false;
            }
        }

        let post: Post = {
            message: <string> event['text'],
            poster: event['user']['screen_name'],
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
