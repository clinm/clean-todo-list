import { TestScheduler } from "rxjs/testing";
import { ALL_ITEM_OPTIONS, REMAINING_ITEM_OPTIONS } from "./todo-options.fixture";
import { InMemoryTodoOptionsService } from "./in-memory-todo-options.service";


describe("Infra > TodoOptions Gateway", () => {

    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    it("Example: Give update events starting with default value", () => {

        // GIVEN
        const optionProducer  = '---b---a';
        const firstConsumer   = 'a--b---a';
        const delaySubs       = '-^------';
        const delayConsumer   = '-a-b---a';

        const optionsValues = {
            a: REMAINING_ITEM_OPTIONS,
            b: ALL_ITEM_OPTIONS
        };
        const optionsProducer = testScheduler.createColdObservable(optionProducer, optionsValues);
        const inMemoryTodoOptionsService = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);

        // WHEN
        optionsProducer.subscribe(options => inMemoryTodoOptionsService.update(options));

        const res$ = inMemoryTodoOptionsService.get();
        const resDelayed$ = inMemoryTodoOptionsService.get();

        // THEN
        testScheduler.expectObservable(res$).toBe(firstConsumer, optionsValues);
        testScheduler.expectObservable(resDelayed$, delaySubs).toBe(delayConsumer, optionsValues);
        testScheduler.flush();
    });
});