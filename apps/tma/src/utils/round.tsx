export function round(num: number, precision: number = 2): number {
  const factor = Math.pow(10, precision)
  return Math.round(num * factor) / factor
}
