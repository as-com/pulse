import {Ingester, Post} from "../Ingester";
import {EventEmitter} from 'events';
import {Stream} from "stream";
import {isObject, isString} from "util";
import fs = require('fs');

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env["TWITTER_CONSUMER_KEY"],
    consumer_secret: process.env["TWITTER_CONSUMER_SECRET"],
    access_token_key: process.env["TWITTER_ACCESS_TOKEN_KEY"],
    access_token_secret: process.env["TWITTER_ACCESS_TOKEN_SECRET"]
});

let users = (<string> fs.readFileSync('twitter-5000.txt', 'utf8')).replace('\n', ',');
console.log(users);

export class TwitterIngest extends EventEmitter implements Ingester {
    twstream: Stream;

    constructor() {
        this.establish_stream();
    }

    establish_stream() {
        var that = this;
        this.twstream = client.stream('statuses/filter', {follow: users});

        this.twstream.on('data', function(event) {
            that.process_data(event);
        });

        this.twstream.on('error', function(error) {
            console.error(error);
            that.establish_stream();
        });
    }

    process_data(event) {
        if (!isObject(event['contributors'])) {
            return;
        }

        if (!isString(event['id_str'])) {
            return;
        }

        if (!isString(event['text'])) {
            return;
        }

        console.log(event && event['text']);

        let post: Post = {
            message: <string> event['text'],
            time: new Date(event['created_at']),
            hashtags: event['entities']['hashtags'],
            mentions: event['entities']['user_mentions'],
            source: "Twitter",
        };
        this.emit("post", [post]);
    }

}
