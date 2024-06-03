import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';
import { InMemoryTodoListService } from "../../infra/todo-list/in-memory-todo-list.service";
import { oneTodo } from "../../infra/todo-list/todo-list.fixture";
import { UpdateTodoItemGateway } from '../../infra/todo-list/todo-list.gateway';
import { InMemoryTodoOptionsService } from '../../infra/todo-options/in-memory-todo-options.service';
import { REMAINING_ITEM_OPTIONS } from '../../infra/todo-options/todo-options.fixture';
import { UpdateTodoOptionsGateway } from '../../infra/todo-options/todo-options.gateway';
import { TodoListService } from '../../services/todo-list.service';
import { GetTodoListUsecase } from "../../usecases/get-todo-list/get-todo-list.usecase";
import { GetTodoOptionsUsecase } from '../../usecases/get-todo-options/get-todo-options.usecase';
import { HomeComponent } from "./home.component";

describe("Home", () => {

    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let loader: HarnessLoader;

    it("Example : Init with predefined filters", fakeAsync(async() => {
      // GIVEN
      const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
      const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
      givenConfiguration(todoListGateway, todoOptionGateway);

      // WHEN
      whenComponentInit();

      // THEN
      await expectItemsCount(2);
    }));

    it("Example : Checked item with remaining filter", fakeAsync(async() => {
      // GIVEN
      const todoListGateway = new InMemoryTodoListService([oneTodo(1, false), oneTodo(2, false)]);
      const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
      givenConfiguration(todoListGateway, todoOptionGateway);

      // WHEN
      whenComponentInit();
      await whenCheckItemNumber(1);

      // THEN
      await expectItemsCount(1);
    }));

    it("Example : Display all items", fakeAsync(async() => {
      // GIVEN
      const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
      const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
      givenConfiguration(todoListGateway, todoOptionGateway);

      // WHEN
      whenComponentInit();
      await whenSelectAll();

      // THEN
      await expectItemsCount(3);
    }));

    function givenConfiguration(todoListGateway: InMemoryTodoListService, optionGateway: InMemoryTodoOptionsService): void {
      const todoListService = new TodoListService(todoListGateway, todoListGateway);
      TestBed.configureTestingModule({
        imports: [HomeComponent],
        providers: [
          { provide: GetTodoListUsecase, useValue: new GetTodoListUsecase(todoListService, optionGateway)},
          { provide: GetTodoOptionsUsecase, useValue: new GetTodoOptionsUsecase(optionGateway)},
          { provide: UpdateTodoOptionsGateway, useValue: optionGateway},
          { provide: UpdateTodoItemGateway, useValue: todoListGateway}
        ]
      });
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
    }

    async function expectItemsCount(count: number) {
      const appItems = await loader.getAllHarnesses(MatCheckboxHarness);
      expect(appItems.length).toEqual(count);
    }

    function whenComponentInit() {
      component.ngOnInit();
      waitForLoading();
    }

    function waitForLoading() {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }
    
    async function whenSelectAll() {
      const groups = await loader.getAllHarnesses(MatRadioButtonHarness);
      await groups[0].check();
      waitForLoading();
    }

    async function whenCheckItemNumber(index: number) {
      const appItems = await loader.getAllHarnesses(MatCheckboxHarness);
      await appItems[index].check();
    }
});

