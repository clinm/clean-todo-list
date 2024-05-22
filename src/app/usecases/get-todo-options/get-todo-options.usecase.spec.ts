import { InMemoryTodoOptionsService } from "../../infra/todo-options/in-memory-todo-options.service";
import { GetTodoOptionsUsecase } from "./get-todo-options.usecase";
import { REMAINING_ITEM_OPTIONS } from '../../infra/todo-options/todo-options.fixture';
import { TodoOptionsBuilder } from "./todo-options.builder";

describe("Feature: Options", () => {

    it("Example: Retrieve stored options", (done) => {
        // GIVEN
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoOptionUsecase = new GetTodoOptionsUsecase(todoOptionGateway);

        // WHEN
        const res$ = getTodoOptionUsecase.run();

        // THEN
        const expected = new TodoOptionsBuilder().withRemaining(true).build();
        res$.subscribe(option => {
            expect(option).toEqual(expected);
            done();
        })
        
    });
});