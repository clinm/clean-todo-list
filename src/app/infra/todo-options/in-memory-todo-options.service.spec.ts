import { TestScheduler } from "rxjs/testing";
import { ALL_ITEM_OPTIONS, REMAINING_ITEM_OPTIONS } from "./todo-options.fixture";
import { InMemoryTodoOptionsService } from "./in-memory-todo-options.service";


describe("Infra", () => {

    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    describe("TodoOptions Gateway", () => {

        it("Example: Give update events starting with default value", () => {
            testScheduler.run((helpers) => {
                const { cold, expectObservable } = helpers;

                // GIVEN
                const optionProducer  = '---b---a';
                const firstConsumer   = 'a--b---a';
                const delaySubs       = '-^------';
                const delayConsumer   = '-a-b---a';

                const optionsValues = {
                    a: REMAINING_ITEM_OPTIONS,
                    b: ALL_ITEM_OPTIONS
                };
                const optionsProducer = cold(optionProducer, optionsValues);
                const inMemoryTodoOptionsService = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);

                // WHEN
                optionsProducer.subscribe(options => inMemoryTodoOptionsService.update(options));

                const res$ = inMemoryTodoOptionsService.get();
                const resDelayed$ = inMemoryTodoOptionsService.get();

                // THEN
                expectObservable(res$).toBe(firstConsumer, optionsValues);
                expectObservable(resDelayed$, delaySubs).toBe(delayConsumer, optionsValues);

            })
        });
    })
});