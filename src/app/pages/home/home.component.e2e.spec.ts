import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MatRadioButtonHarness } from '@angular/material/radio/testing';
import { InMemoryTodoListService } from "../../infra/todo-list/in-memory-todo-list.service";
import { oneTodo } from "../../infra/todo-list/todo-list.fixture";
import { GetTodoListUsecase } from "../../usecases/get-todo-list/get-todo-list.usecase";
import { HomeComponent } from "./home.component";

describe("Home", () => {

    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let loader: HarnessLoader;

    it("Example : Init with predefined filters", fakeAsync(() => {
      // GIVEN
      const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
      givenConfiguration(todoListGateway);

      // WHEN
      whenComponentInit();

      // THEN
      expectItemsCount(2);
    }));

    it("Example : Display all items", fakeAsync(async() => {
      // GIVEN
      const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
      givenConfiguration(todoListGateway);

      // WHEN
      whenComponentInit();
      await whenSelectAll();

      // THEN
      expectItemsCount(3);
    }));

    function givenConfiguration(gateway: InMemoryTodoListService): void {
      TestBed.configureTestingModule({
        imports: [HomeComponent],
        providers: [
          { provide: GetTodoListUsecase, useValue: new GetTodoListUsecase(gateway)}
        ]
      });
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
    }

    function expectItemsCount(count: number): void {
      const appItems: HTMLElement[] = fixture.nativeElement.querySelectorAll("mat-checkbox");
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
});

