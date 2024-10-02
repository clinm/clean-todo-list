import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { infraRootProvider } from '../../infra/infra.provider';
import { InMemoryTodoListService } from "../../infra/todo-list/in-memory-todo-list.service";
import { oneTodo } from "../../infra/todo-list/todo-list.fixture";
import { InMemoryTodoOptionsService } from '../../infra/todo-options/in-memory-todo-options.service';
import { REMAINING_ITEM_OPTIONS } from '../../infra/todo-options/todo-options.fixture';
import { servicesProvider } from '../../services/services.provider';
import { usecasesProviders } from '../../usecases/usecases.provider';
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
      await expectRemainingOptionSelected();
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

    it("Example : Creates a new item", fakeAsync(async() => {
      // GIVEN
      const todoListGateway = new InMemoryTodoListService([]);
      const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
      givenConfiguration(todoListGateway, todoOptionGateway);

      // WHEN
      whenComponentInit();
      await whenCreateItem("My added item");
      await whenValidateCreateForm();

      // THEN
      await expectItemsCount(1);
    }));

    it("Example : Cannot create empty item", fakeAsync(async() => {
      // GIVEN
      const todoListGateway = new InMemoryTodoListService([]);
      const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
      givenConfiguration(todoListGateway, todoOptionGateway);

      // WHEN
      whenComponentInit();
      await whenCreateItem("");
      await whenValidateCreateForm();

      // THEN
      await expectItemsCount(0);
    }));

    function givenConfiguration(todoListGateway: InMemoryTodoListService, optionGateway: InMemoryTodoOptionsService): void {
      TestBed.configureTestingModule({
        imports: [HomeComponent],
        providers: [
          infraRootProvider(todoListGateway, optionGateway),
          servicesProvider(),
          usecasesProviders(),
          provideAnimationsAsync('noop')
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

    async function whenCreateItem(title: string) {
      const input = await loader.getHarness(MatInputHarness);
      await input.setValue(title);  
    }

    async function whenValidateCreateForm() {
      const submitButton = await loader.getHarness(MatButtonHarness);
      await submitButton.click();
    }

    async function expectRemainingOptionSelected() {
      const groups = await loader.getAllHarnesses(MatRadioButtonHarness);
      const isChecked = await groups[1].isChecked();
      expect(isChecked).toBeTrue();
    }

    async function whenCheckItemNumber(index: number) {
      const appItems = await loader.getAllHarnesses(MatCheckboxHarness);
      await appItems[index].check();
    }
});

