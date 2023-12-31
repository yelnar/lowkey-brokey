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
  selectHasCompleted,
} from "./selectors";
import {
  activate,
  addExpense,
  syncCurrentDate,
  checkCurrentDate,
  calculate,
  countRemainingDays,
  updateCurrentDate,
  deactivate,
  deleteExpense,
} from "./thunks";

describe("Brokey", () => {
  let store: Store;
  const previousDate = "2019-12-31";
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

    it("marks brokey as active and not completed", () => {
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

  describe("When deleting an expense", () => {
    beforeEach(() => {
      const endDate = new Date(after30Days);
      inMemoryDateService.config.length = 30;

      store.dispatch(activate(3000, endDate));
      store.dispatch(
        addExpense(10, new Date(`${currentDate}T13:00:00Z`).getTime())
      );
      store.dispatch(
        addExpense(20, new Date(`${currentDate}T13:15:00Z`).getTime())
      );
      store.dispatch(
        addExpense(30, new Date(`${currentDate}T13:30:00Z`).getTime())
      );
    });

    it("adds the expense amount to remaining budget", () => {
      store.dispatch(
        deleteExpense(new Date(`${currentDate}T13:15:00Z`).getTime())
      );
      expect(selectRemainingBudget(store.getState())).toEqual(2960);
    });

    it("adds the expense amount to current balance", () => {
      store.dispatch(
        deleteExpense(new Date(`${currentDate}T13:15:00Z`).getTime())
      );
      expect(selectCurrentBalance(store.getState())).toEqual(60);
    });

    it("removes deleted expense from the expenses", () => {
      store.dispatch(
        deleteExpense(new Date(`${currentDate}T13:15:00Z`).getTime())
      );
      expect(selectExpenses(store.getState())).toEqual([
        {
          amount: 10,
          timestamp: new Date(`${currentDate}T13:00:00Z`).getTime(),
        },
        {
          amount: 30,
          timestamp: new Date(`${currentDate}T13:30:00Z`).getTime(),
        },
      ]);
    });

    it("does not change remaining budget if expense does not exist", () => {
      store.dispatch(
        deleteExpense(new Date(`${currentDate}T13:45:00Z`).getTime())
      );
      expect(selectRemainingBudget(store.getState())).toEqual(2940);
    });

    it("does not change current balance if expense does not exist", () => {
      store.dispatch(
        deleteExpense(new Date(`${currentDate}T13:45:00Z`).getTime())
      );
      expect(selectCurrentBalance(store.getState())).toEqual(40);
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

  describe("When budget plan finishes", () => {
    beforeEach(() => {
      inMemoryDateService.config.currentDate = previousDate;
      const endDate = new Date(previousDate);
      inMemoryDateService.config.length = 1;
      inMemoryDateService.config.formattedDate = previousDate;
      store.dispatch(activate(100, endDate));

      inMemoryDateService.config.currentDate = currentDate;
      inMemoryDateService.config.length = -1;
    });

    it("marks brokey as completed", () => {
      store.dispatch(syncCurrentDate());
      expect(selectHasCompleted(store.getState())).toEqual(true);
    });

    it("does not change currentBalance", () => {
      store.dispatch(syncCurrentDate(false));
      expect(selectCurrentBalance(store.getState())).toEqual(100);
    });

    it("does not change daily budget", () => {
      store.dispatch(syncCurrentDate());
      expect(selectDailyBudget(store.getState())).toEqual(100);
    });

    it("marks brokey as non-completed after re-activating", () => {
      store.dispatch(syncCurrentDate());
      expect(selectHasCompleted(store.getState())).toEqual(true);

      inMemoryDateService.config.currentDate = currentDate;
      const endDate = new Date(currentDate);
      inMemoryDateService.config.length = 1;
      inMemoryDateService.config.formattedDate = currentDate;
      store.dispatch(activate(100, endDate));
      expect(selectHasCompleted(store.getState())).toEqual(false);
    });
  });

  describe("When deactivating", () => {
    beforeEach(() => {
      inMemoryDateService.config.currentDate = currentDate;
      const endDate = new Date(currentDate);
      inMemoryDateService.config.length = 1;
      inMemoryDateService.config.formattedDate = currentDate;
      store.dispatch(activate(100, endDate));
    });

    it("marks brokey as inactive and not completed", () => {
      store.dispatch(deactivate());
      expect(store.getState().brokey.isActive).toEqual(false);
      expect(store.getState().brokey.hasCompleted).toEqual(false);
    });

    it("resets start date, end date, total budget, and daily budget", () => {
      store.dispatch(deactivate());
      expect(selectStartDate(store.getState())).toEqual("");
      expect(selectEndDate(store.getState())).toEqual("");
      expect(selectTotalBudget(store.getState())).toEqual(0);
      expect(selectDailyBudget(store.getState())).toEqual(0);
    });

    it("resets remaining budget", () => {
      store.dispatch(deactivate());
      expect(selectRemainingBudget(store.getState())).toEqual(0);
    });

    it("resets current balance", () => {
      store.dispatch(deactivate());
      expect(selectCurrentBalance(store.getState())).toEqual(0);
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
