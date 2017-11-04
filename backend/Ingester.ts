import {EventEmitter} from 'events';

export interface Post {
	message: string;
	poster: string;
	time: Date;
	hashtags: string[];
	mentions: string[];
	source: string;
}

export interface Ingester extends EventEmitter {
	emit(event: "post", posts: Post[]): boolean;
	on(event: "post", listener: (posts: Post[]) => void): this;
}