import {Aggregator} from "../Aggregator";
import {Post} from "../Ingester";
import * as _ from 'lodash';

export class Toxicity extends Aggregator {
	private request = _.throttle(message => {

	}, );

	_process(post: Post) {
	}

	calc() {
	}

}