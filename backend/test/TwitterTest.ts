require("dotenv").config();
import {TwitterIngest} from "../ingesters/TwitterIngest";

const ing = new TwitterIngest();
ing.on('post', function (p) {
    // console.log("recv");
    console.log(p);
});
