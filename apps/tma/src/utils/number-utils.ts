export class NumberUtils {
  static DefaultLocale = 'en-US'

  static round(num: number, precision: number = 2): number {
    const factor = Math.pow(10, precision)
    return Math.round(num * factor) / factor
  }

  static formatToLocale(
    num: number,
    locale = NumberUtils.DefaultLocale
  ): string {
    return num.toLocaleString(locale)
  }

  static formatAmount(amount: number, locale = NumberUtils.DefaultLocale) {
    return NumberUtils.formatToLocale(NumberUtils.round(amount, 2), locale)
  }
}
