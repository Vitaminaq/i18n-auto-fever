export type Task = any;

export class TaskQueueSync {
	private queue: any[] = [];
	private working = false;
	private worker?: Promise<void>;

	public get length() {
		return this.queue.length;
	}

	public get isComplete() {
		return !this.working;
	}

	async enqueue(...task: Task[]) {
		this.queue.push(...task);
		this.worker || (this.worker = this.start());
		await this.worker;
		this.worker = void 0;
	}

	public waitForCompletion() {
		return this.worker ? this.worker : Promise.resolve();
	}

	async start() {
		let task = this.queue.shift();

		while (typeof task !== "undefined") {
			await task();
			task = this.queue.shift();
		}
	}
}
