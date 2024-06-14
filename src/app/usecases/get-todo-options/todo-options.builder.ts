import { TodoOptionVm } from "./todo-options.vm";

export class TodoOptionsBuilder {

    protected remaining!: boolean;

    protected totalItemCount: number = 0;

    protected remainingItemCount: number = 0;

    public withRemaining(remaining: boolean): this {
        this.remaining = remaining;
        return this;
    }

    public withCounters(remaining: number, total: number): this {
        this.totalItemCount = total;
        this.remainingItemCount = remaining;
        return this;
    }

    public build(): TodoOptionVm {
        return { remaining: this.remaining, totalItemCount: this.totalItemCount, remainingItemCount: this.remainingItemCount };
    }
}