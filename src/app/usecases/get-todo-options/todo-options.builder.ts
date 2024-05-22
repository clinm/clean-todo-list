import { TodoOptionVm } from "./todo-options.vm";

export class TodoOptionsBuilder {

    protected remaining!: boolean;

    public withRemaining(remaining: boolean): this {
        this.remaining = remaining;
        return this;
    }

    public build(): TodoOptionVm {
        return { remaining: this.remaining };
    }
}