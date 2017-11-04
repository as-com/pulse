import {Post} from "./Ingester";
import _ = require("lodash");

export abstract class Aggregator {
	private _calc = _.throttle(() => {
		const a = this.calc();
		if (a !== null) {
			this.broadcast(a);
		}
	}, 500, {
		leading: true,
		trailing: true
	});

	constructor(protected broadcast: (message: any) => void) {

	}

	public process(post: Post) {
		this._process(post);

		this._calc();
	}
	abstract _process(post: Post);
	abstract calc();
}