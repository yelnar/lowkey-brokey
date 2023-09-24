import { Expense } from "../models/expense";

export function calculateBudgetPerDay(
  totalBudget: number,
  duration: number,
  expenses: Expense[] = []
): number {
  const remainingBudget = expenses.reduce(
    (budget, expense) => budget - expense.amount,
    totalBudget
  );

  return Math.round((100 * remainingBudget) / duration) / 100;
}
