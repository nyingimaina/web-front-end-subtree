namespace Jattac.Apps.CompanyMan.Reporting
{
    public interface IReportingHelper
    {
        (DateTime earlierDate, DateTime laterDate) GetDatesSorted(DateTime dateOne, DateTime dateTwo, bool toUniversalTime);
    }
    public class ReportingHelper : IReportingHelper
    {
        public (DateTime earlierDate, DateTime laterDate) GetDatesSorted(DateTime dateOne, DateTime dateTwo, bool toUniversalTime)
        {
            Func<DateTime, DateTime> convertToUniversalTime = date =>
                date.Kind == DateTimeKind.Utc ? date : date.ToUniversalTime();

            DateTime earlierDate = dateOne < dateTwo ? dateOne : dateTwo;
            DateTime laterDate = dateOne > dateTwo ? dateOne : dateTwo;

            if (toUniversalTime)
            {
                earlierDate = convertToUniversalTime(earlierDate);
                laterDate = convertToUniversalTime(laterDate);
            }

            return (earlierDate, laterDate);
        }
    }
}