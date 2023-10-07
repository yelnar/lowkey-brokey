import { AppThunk } from "../create-store";
import { Expense } from "./models/expense";
import {
  activated,
  currentBalanceIncreased,
  currentDateChanged,
  dailyBudgetUpdated,
  currentDatePassed,
  expenseAdded,
  calculationSucceeded,
  remainingDaysUpdated,
  BrokeyState,
  hydrate,
} from "./slice";
import { calculateBudgetPerDay } from "./utils/calculate-budget-per-day";

export const hydrateBrokey =
  (persistedState: BrokeyState): AppThunk =>
  (dispatch, _getState) => {
    dispatch(hydrate(persistedState));
  };

export const calculate =
  (totalBudget: number, end: Date, expenses: Expense[] = []): AppThunk =>
  (dispatch, _getState, { dateService }) => {
    const startDate = dateService.currentDate;
    const endDate = dateService.format(end);
    const duration = dateService.duration(startDate, endDate);

    const dailyBudget = calculateBudgetPerDay(totalBudget, duration, expenses);

    dispatch(
      calculationSucceeded({
        startDate,
        endDate,
        duration,
        totalBudget,
        dailyBudget,
      })
    );
  };

export const activate =
  (totalBudget: number, end: Date): AppThunk =>
  (dispatch, getState) => {
    dispatch(calculate(totalBudget, end));

    const { brokey } = getState();
    const {
      calculator: { startDate, endDate, dailyBudget },
    } = brokey;

    dispatch(
      activated({
        startDate,
        endDate,
        totalBudget,
        dailyBudget,
        currentBalance: dailyBudget,
      })
    );
  };

export const addExpense =
  (amount: number, timestamp: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(expenseAdded({ amount, timestamp }));
  };

export const checkCurrentDate =
  (): AppThunk =>
  (dispatch, getState, { dateService }) => {
    const state = getState();

    if (!state.brokey.isActive) {
      return;
    }

    const { currentDate } = state.brokey;

    if (dateService.currentDate === currentDate) {
      dispatch(currentDatePassed(false));
      return;
    }

    dispatch(currentDatePassed(true));
  };

export const syncCurrentDate =
  (spreadCurrentBalance = true): AppThunk =>
  (dispatch, getState, { dateService }) => {
    const currentDate = dateService.currentDate;
    dispatch(currentDateChanged(currentDate));

    const state = getState();

    if (!state.brokey.isActive) {
      return;
    }

    const { currentBalance, dailyBudget } = state.brokey;

    if (currentBalance > 0 && !spreadCurrentBalance) {
      dispatch(currentBalanceIncreased(dailyBudget));
      return;
    }

    const newDailyBudget = calculateBudgetPerDay(
      state.brokey.remainingBudget,
      dateService.duration(currentDate, state.brokey.endDate)
    );

    dispatch(dailyBudgetUpdated(newDailyBudget));
  };

export const countRemainingDays =
  (): AppThunk =>
  (dispatch, getState, { dateService }) => {
    const state = getState();

    if (!state.brokey.isActive) {
      return;
    }

    const currentDate = dateService.currentDate;
    const { endDate } = state.brokey;
    const remainingDays = dateService.duration(currentDate, endDate);

    dispatch(remainingDaysUpdated(remainingDays));
  };
