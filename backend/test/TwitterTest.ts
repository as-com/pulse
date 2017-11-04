import {TwitterIngest} from "../ingesters/TwitterIngest";

require("dotenv").config();

const ing = new TwitterIngest();
ing.on('post', function (p) {
    console.log(p);
});
