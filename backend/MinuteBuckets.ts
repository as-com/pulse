import Timer = NodeJS.Timer;

export class BucketValue<T> {
	constructor(public time: Date, public value: T) {

	}
}

export class MinuteBuckets<T> {
	private prev: BucketValue<T>[] = [];
	private curr: BucketValue<T>[] = [];

	private interval: Timer;

	constructor(private bucketDur = 5000) {
		this.interval = setInterval(() => {
			this.prev = this.curr;
			this.curr = [];
		}, bucketDur);
	}

	push(time: Date, value: T) {
		this.curr.push(new BucketValue(time, value));
	}

	forEach(callback: (val: T) => void) {
		const past = Date.now() - this.bucketDur;
		for (let i = this.curr.length - 1; i >= 0; i--) {
			callback(this.curr[i].value);
		}

		for (let i = this.prev.length - 1; i >= 0 && this.prev[i].time.getTime() > past; i--) {
			callback(this.prev[i].value);
		}
	}

	dispose() {
		clearInterval(this.interval);
	}
}