import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Expense } from "./models/expense";
import { CanonicalDate } from "./models/canonical-date";

export type BrokeyState = {
  totalBudget: number;
  remainingBudget: number;
  currentDate: CanonicalDate;
  startDate: CanonicalDate;
  endDate: CanonicalDate;
  expenses: Expense[];
  dailyBudget: number;
  currentBalance: number;
  isActive: boolean;
  hasCurrentDatePassed: boolean | undefined;

  remainingDays: number;

  calculator: {
    startDate: CanonicalDate;
    endDate: CanonicalDate;
    totalBudget: number;
    dailyBudget: number;
    duration: number;
  };
};

// @ts-ignore
function _createExpense(i: number): Expense {
  return {
    timestamp: Date.now() - Math.round(Math.random() * 96 * 60 * 60 * 1000),
    amount: 2,
  };
}

const initialBrokeyState: BrokeyState = {
  totalBudget: 0,
  remainingBudget: 0,
  currentDate: "",
  startDate: "",
  endDate: "",
  // expenses: Array(100)
  //   .fill(null)
  //   .map((i) => _createExpense(i))
  //   .sort((a, b) => a.timestamp - b.timestamp),
  expenses: [],
  dailyBudget: 0,
  currentBalance: 0,
  isActive: false,
  hasCurrentDatePassed: undefined,

  remainingDays: 0,

  calculator: {
    startDate: "",
    endDate: "",
    totalBudget: 0,
    dailyBudget: 0,
    duration: 0,
  },
};

export const brokeySlice = createSlice({
  name: "brokey",
  initialState: initialBrokeyState,
  reducers: {
    hydrate: (state, action: PayloadAction<BrokeyState>) => {
      Object.assign(state, action.payload);
    },

    currentDateChanged: (state, action: PayloadAction<CanonicalDate>) => {
      state.currentDate = action.payload;
    },

    calculationSucceeded: (
      state,
      action: PayloadAction<{
        totalBudget: number;
        startDate: CanonicalDate;
        endDate: CanonicalDate;
        dailyBudget: number;
        duration: number;
      }>
    ) => {
      state.calculator.totalBudget = action.payload.totalBudget;
      state.calculator.startDate = action.payload.startDate;
      state.calculator.endDate = action.payload.endDate;
      state.calculator.dailyBudget = action.payload.dailyBudget;
      state.calculator.duration = action.payload.duration;
    },

    activated: (
      state,
      action: PayloadAction<{
        totalBudget: number;
        startDate: CanonicalDate;
        endDate: CanonicalDate;
        dailyBudget: number;
        currentBalance: number;
        currentDate: CanonicalDate;
      }>
    ) => {
      state.isActive = true;
      state.totalBudget = action.payload.totalBudget;
      state.remainingBudget = action.payload.totalBudget;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.dailyBudget = action.payload.dailyBudget;
      state.currentBalance = action.payload.currentBalance;
      state.currentDate = action.payload.currentDate;
      state.expenses = [];
    },

    expenseAdded: (state, action: PayloadAction<Expense>) => {
      state.expenses.push({ ...action.payload });
      state.currentBalance -= action.payload.amount;
      state.remainingBudget -= action.payload.amount;
    },

    dailyBudgetUpdated: (state, action: PayloadAction<number>) => {
      state.dailyBudget = action.payload;
      state.currentBalance = action.payload;
    },

    currentBalanceIncreased: (state, action: PayloadAction<number>) => {
      state.currentBalance += action.payload;
    },

    currentDatePassed: (state, action: PayloadAction<boolean>) => {
      state.hasCurrentDatePassed = action.payload;
    },

    remainingDaysUpdated: (state, action: PayloadAction<number>) => {
      state.remainingDays = action.payload;
    },
  },
});

export const {
  hydrate,
  currentDateChanged,
  calculationSucceeded,
  activated,
  expenseAdded,
  dailyBudgetUpdated,
  currentBalanceIncreased,
  currentDatePassed,
  remainingDaysUpdated,
} = brokeySlice.actions;

export default brokeySlice.reducer;
