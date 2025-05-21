export default class ReportingHelper {
  static get firstDayOfThisMonth(): Date {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  static get appStartDate(): Date {
    return new Date(2000, 0, 1);
  }
}
