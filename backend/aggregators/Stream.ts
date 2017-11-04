import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import * as _ from 'lodash';

export class Stream extends Aggregator {
    private queue : Post[] = [];

    _process(post: Post) {
        this.queue.push(post);
    }

    calc() {
        // randomly pick one
        const qu = _.shuffle(this.queue);
        if (qu.length > 2) {
            const chosen = qu[1];

            setTimeout(() => { this.broadcast(qu[0])}, 250);

            return chosen;
        }
        return null;
    }

}