import { InMemoryDateService } from "../../infrastructure/driven/in-memory-date.service";
import { Store, createStore } from "../create-store";
import {
  selectCurrentBalance,
  selectDailyBudget,
  selectEndDate,
  selectExpenses,
  selectHasCurrentDatePassed,
  selectIsActive,
  selectRemainingBudget,
  selectStartDate,
  selectTotalBudget,
  selectCalculator,
  selectRemainingDays,
} from "./selectors";
import {
  activate,
  addExpense,
  syncCurrentDate,
  checkCurrentDate,
  calculate,
  countRemainingDays,
  updateCurrentDate,
} from "./thunks";

describe("Brokey", () => {
  let store: Store;
  const currentDate = "2020-01-01";
  const nextDate = "2020-01-02";
  const after30Days = "2020-01-30";

  let inMemoryDateService: InMemoryDateService;

  beforeEach(() => {
    inMemoryDateService = new InMemoryDateService({ currentDate });
    store = createStore({ dateService: inMemoryDateService });
    store.dispatch(updateCurrentDate());
  });

  describe("When calculating", () => {
    it("saves total budget", () => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;

      store.dispatch(calculate(3000, endDate));
      expect(selectCalculator(store.getState()).totalBudget).toEqual(3000);
    });

    it("saves start and end dates", () => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;
      inMemoryDateService.config.formattedDate = after30Days;

      store.dispatch(calculate(3000, endDate));
      expect(selectCalculator(store.getState()).startDate).toEqual(currentDate);
      expect(selectCalculator(store.getState()).endDate).toEqual(after30Days);
    });

    it("counts days between start and end dates, including start date and end date", () => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;

      store.dispatch(calculate(3000, endDate));
      expect(selectCalculator(store.getState()).duration).toEqual(30);
    });

    describe("Daily budget", () => {
      it("equals to total budget if start and end dates are the same", () => {
        const endDate = new Date(currentDate);
        inMemoryDateService.config.length = 1;

        store.dispatch(calculate(3000, endDate));
        expect(selectCalculator(store.getState()).dailyBudget).toEqual(3000);
      });

      it("equals to total budget divided by number of days between start and end dates", () => {
        const endDate = new Date(after30Days);
        inMemoryDateService.config.length = 30;

        store.dispatch(calculate(3000, endDate));
        expect(selectCalculator(store.getState()).dailyBudget).toEqual(100);
      });
    });
  });

  describe("When activating", () => {
    it("copies start date, end date, total budget, and daily budget from calculator", () => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;

      store.dispatch(activate(3000, endDate));

      expect(selectStartDate(store.getState())).toEqual(
        selectCalculator(store.getState()).startDate
      );
      expect(selectEndDate(store.getState())).toEqual(
        selectCalculator(store.getState()).endDate
      );
      expect(selectTotalBudget(store.getState())).toEqual(
        selectCalculator(store.getState()).totalBudget
      );
      expect(selectDailyBudget(store.getState())).toEqual(
        selectCalculator(store.getState()).dailyBudget
      );
    });

    it("marks brokey as active", () => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;

      expect(selectIsActive(store.getState())).toEqual(false);

      store.dispatch(activate(3000, endDate));

      expect(selectIsActive(store.getState())).toEqual(true);
    });

    describe("Remaining budget", () => {
      it("equals to total budget from calculator", () => {
        const endDate = new Date(after30Days);
        inMemoryDateService.config.length = 30;

        store.dispatch(activate(3000, endDate));

        expect(selectRemainingBudget(store.getState())).toEqual(
          selectCalculator(store.getState()).totalBudget
        );
      });
    });

    describe("Current balance", () => {
      it("equals to daily budget from calculator", () => {
        const endDate = new Date(after30Days);
        inMemoryDateService.config.length = 30;

        store.dispatch(activate(3000, endDate));

        expect(selectCurrentBalance(store.getState())).toEqual(
          selectCalculator(store.getState()).dailyBudget
        );
      });
    });
  });

  describe("When adding an expense", () => {
    const currentDateTime = new Date(`${currentDate}T13:00:00Z`).getTime();
    const expenseAmount = 20;

    beforeEach(() => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;

      store.dispatch(activate(3000, endDate));
      store.dispatch(addExpense(expenseAmount, currentDateTime));
    });

    it("subtracts the expense amount from remaining budget", () => {
      expect(selectRemainingBudget(store.getState())).toEqual(2980);
    });

    it("subtracts the expense amount from current balance", () => {
      expect(selectCurrentBalance(store.getState())).toEqual(80);
    });

    it("saves newly added expense", () => {
      expect(selectExpenses(store.getState())).toEqual([
        { amount: 20, timestamp: currentDateTime },
      ]);
    });
  });

  describe("When forwarding to new date", () => {
    describe("Checking if current date has passed", () => {
      it("marks undefined initially", () => {
        expect(selectHasCurrentDatePassed(store.getState())).toEqual(undefined);
      });

      it("does not check if calculator is not active", () => {
        inMemoryDateService.config.currentDate = nextDate;
        expect(selectIsActive(store.getState())).toEqual(false);

        store.dispatch(checkCurrentDate());

        expect(selectHasCurrentDatePassed(store.getState())).toEqual(undefined);
      });

      it("marks current date as passed if it is before actual current date", () => {
        inMemoryDateService.config.currentDate = currentDate;
        const endDate = new Date(after30Days);
        inMemoryDateService.config.length = 30;
        store.dispatch(activate(3000, endDate));

        inMemoryDateService.config.currentDate = nextDate;
        store.dispatch(checkCurrentDate());

        expect(selectHasCurrentDatePassed(store.getState())).toEqual(true);
      });

      it("marks current date as NOT passed if it equals to actual current date", () => {
        inMemoryDateService.config.currentDate = currentDate;
        const endDate = new Date(after30Days);
        inMemoryDateService.config.length = 30;
        store.dispatch(activate(3000, endDate));

        store.dispatch(checkCurrentDate());

        expect(selectHasCurrentDatePassed(store.getState())).toEqual(false);
      });
    });

    describe("When carrying over a positive balance", () => {
      const currentDateTime = new Date(`${currentDate}T13:00:00Z`).getTime();
      const expenseAmount = 60;

      beforeEach(() => {
        const endDate = new Date(after30Days);
        inMemoryDateService.config.length = 30;

        store.dispatch(activate(3000, endDate));
        store.dispatch(addExpense(expenseAmount, currentDateTime));

        expect(selectDailyBudget(store.getState())).toEqual(100);
      });

      describe("When positive balance is spread across remaining period", () => {
        it("increases the daily budget", () => {
          inMemoryDateService.config.currentDate = nextDate;
          inMemoryDateService.config.length = 29;

          store.dispatch(syncCurrentDate());

          expect(selectDailyBudget(store.getState())).toEqual(101.38);
        });

        it("equalizes the current balance to the new daily budget", () => {
          inMemoryDateService.config.currentDate = nextDate;

          store.dispatch(syncCurrentDate());

          expect(selectCurrentBalance(store.getState())).toEqual(
            selectDailyBudget(store.getState())
          );
        });
      });

      describe("When positive balance increases only the current balance of the new date", () => {
        it("does not change daily budget", () => {
          inMemoryDateService.config.currentDate = nextDate;

          store.dispatch(syncCurrentDate(false));

          expect(selectDailyBudget(store.getState())).toEqual(100);
        });

        it("increases the current balance", () => {
          inMemoryDateService.config.currentDate = nextDate;

          store.dispatch(syncCurrentDate(false));

          expect(selectCurrentBalance(store.getState())).toEqual(140);
        });
      });
    });

    describe("When carrying over a negative balance", () => {
      const currentDateTime = new Date(`${currentDate}T13:00:00Z`).getTime();

      beforeEach(() => {
        const endDate = new Date(after30Days);
        inMemoryDateService.config.length = 30;

        store.dispatch(activate(3000, endDate));
        store.dispatch(addExpense(160, currentDateTime));

        expect(selectCurrentBalance(store.getState())).toEqual(-60);
        expect(selectRemainingBudget(store.getState())).toEqual(2840);

        inMemoryDateService.config.currentDate = nextDate;
        inMemoryDateService.config.length = 29;

        store.dispatch(syncCurrentDate());
      });

      it("decreases the daily budget", () => {
        expect(selectDailyBudget(store.getState())).toEqual(97.93);
      });

      it("equalizes the current balance to the new daily budget", () => {
        expect(selectCurrentBalance(store.getState())).toEqual(
          selectDailyBudget(store.getState())
        );
      });
    });
  });

  describe("Remiaing days", () => {
    it("equals to 0 when brokey is not active", () => {
      store.dispatch(countRemainingDays());
      expect(selectRemainingDays(store.getState())).toEqual(0);
    });

    it("equals to number of days between start and end dates (inclusive) when brokey is active", () => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;

      store.dispatch(activate(3000, endDate));
      store.dispatch(countRemainingDays());

      expect(selectRemainingDays(store.getState())).toEqual(30);
    });
  });
});
