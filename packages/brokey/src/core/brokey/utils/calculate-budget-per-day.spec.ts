import { calculateBudgetPerDay } from "./calculate-budget-per-day";

describe("Calculate daily budget", () => {
  test("calculates the daily budget based on start date, end date, and total budget", () => {
    expect(calculateBudgetPerDay(200, 1)).toBe(200);
    expect(calculateBudgetPerDay(200, 2)).toBe(100);
    expect(calculateBudgetPerDay(2500, 25)).toBe(100);
  });

  test("recalculates the daily allowance when expenses added", () => {
    expect(
      calculateBudgetPerDay(2500, 25, [
        {
          timestamp: new Date("2023-06-01T14:24:39.769Z").getTime(),
          amount: 50,
        },
      ])
    ).toBe(98);

    expect(
      calculateBudgetPerDay(2500, 25, [
        {
          timestamp: new Date("2023-06-01T14:24:39.769Z").getTime(),
          amount: 50,
        },
        {
          timestamp: new Date("2023-06-01T18:48:01.769Z").getTime(),
          amount: 25,
        },
      ])
    ).toBe(97);
  });
});
