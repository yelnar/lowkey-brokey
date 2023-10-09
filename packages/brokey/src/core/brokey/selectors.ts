import { AppState } from "../create-store";

export const selectIsActive = (state: AppState) => state.brokey.isActive;
export const selectHasCompleted = (state: AppState) =>
  state.brokey.hasCompleted;
export const selectTotalBudget = (state: AppState) => state.brokey.totalBudget;
export const selectRemainingBudget = (state: AppState) =>
  state.brokey.remainingBudget;
export const selectStartDate = (state: AppState) => state.brokey.startDate;
export const selectEndDate = (state: AppState) => state.brokey.endDate;
export const selectDailyBudget = (state: AppState) => state.brokey.dailyBudget;
export const selectCurrentBalance = (state: AppState) =>
  state.brokey.currentBalance;
export const selectExpenses = (state: AppState) => state.brokey.expenses;
export const selectCurrentDate = (state: AppState) => state.brokey.currentDate;
export const selectHasCurrentDatePassed = (state: AppState) =>
  state.brokey.hasCurrentDatePassed;

export const selectCalculator = (state: AppState) => state.brokey.calculator;

export const selectRemainingDays = (state: AppState) =>
  state.brokey.remainingDays;
