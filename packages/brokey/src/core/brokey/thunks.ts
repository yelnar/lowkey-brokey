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
  completed,
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
  (dispatch, getState, { dateService }) => {
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
        currentDate: dateService.currentDate,
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
    const state = getState().brokey;

    if (!state.isActive) {
      return;
    }

    const { currentDate } = state;

    if (dateService.currentDate === currentDate) {
      dispatch(currentDatePassed(false));
      return;
    }

    dispatch(currentDatePassed(true));
  };

export const updateCurrentDate =
  (): AppThunk =>
  (dispatch, _getState, { dateService }) => {
    const currentDate = dateService.currentDate;
    dispatch(currentDateChanged(currentDate));
  };

export const syncCurrentDate =
  (spreadCurrentBalance = true): AppThunk =>
  (dispatch, getState, { dateService }) => {
    dispatch(checkCurrentDate());

    const { isActive, hasCurrentDatePassed, endDate } = getState().brokey;

    if (!isActive || !hasCurrentDatePassed) {
      return;
    }

    if (dateService.duration(dateService.currentDate, endDate) < 0) {
      dispatch(completed());
      return;
    }

    dispatch(updateCurrentDate());

    const { currentBalance, dailyBudget, remainingBudget, currentDate } =
      getState().brokey;

    if (currentBalance > 0 && !spreadCurrentBalance) {
      dispatch(currentBalanceIncreased(dailyBudget));
      return;
    }

    const newDailyBudget = calculateBudgetPerDay(
      remainingBudget,
      dateService.duration(currentDate, endDate)
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
