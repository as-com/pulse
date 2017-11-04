import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import * as _ from 'lodash';

const tick = 500;
const perSecond = 4;

export class Stream extends Aggregator {
    private queue : Post[] = [];

    _process(post: Post) {
        this.queue.push(post);
    }

    calc() {
        // randomly pick one
        const qu = _.shuffle(this.queue);
        if (qu.length > perSecond) {
            for (let i = 0; i < perSecond; i++) {
                const chosen = qu[i];
                const time = i * tick / perSecond;
                setTimeout(() => { this.broadcast(chosen)}, time);
            }
        }
        this.queue = [];
        return null;
    }

}