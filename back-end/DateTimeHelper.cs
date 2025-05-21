using System.Globalization;

namespace Jattac.Apps.CompanyMan
{
    public static class DateTimeHelper
    {
        private static readonly string[] dateFormats = new[]
        {
            // Date-only formats
            "yyyy-MM-dd", "yyyy/MM/dd", "dd-MM-yyyy", "dd/MM/yyyy", "MM/dd/yyyy",
            "yyyyMMdd", "yy-MM-dd", "dd MMM yyyy", "d MMM yyyy",
            "MMM dd, yyyy", "MMMM dd, yyyy", "yyyy-MM",

            // Date with time formats (now including 12-hour clock with AM/PM)
            "yyyy-MM-ddTHH:mm:ss", "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ss.fff",
            "yyyy-MM-ddTHH:mm:ss.fffZ", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm",
            "yyyy-MM-ddTHH:mm", "MM/dd/yyyy HH:mm:ss", "MM/dd/yyyy HH:mm",
            "dd/MM/yyyy HH:mm:ss", "dd/MM/yyyy HH:mm",
            
            // 12-hour format with AM/PM
            "MM/dd/yyyy h:mm tt",            // 12/9/2024 8:47 AM
            "MM/dd/yyyy h:mm:ss tt",         // 12/9/2024 8:47:23 AM
            "MM/dd/yyyy h:mm tt",            // 12/9/2024 8:47 AM
            "d MMM yyyy h:mm tt",            // 9 Dec 2024 8:47 AM

            // Time-only formats
            "HH:mm:ss", "HH:mm", "HH:mm:ss.fff",

            // Time zone formats
            "yyyy-MM-ddTHH:mm:sszzz", "yyyyMMddTHHmmssZ",

            // RFC and compact formats
            "ddd, dd MMM yyyy HH:mm:ss GMT", "ddd, dd MMM yyyy HH:mm:ss zzz",
            "ddd MMM dd HH:mm:ss yyyy"
        };

        public static DateTime ParseDate(object? input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.ToString()))
                throw new ArgumentNullException(nameof(input), "Input date cannot be null or empty.");

            string dateString = input.ToString()!;

            // First, attempt general parsing with TryParse (handles most cases)
            if (DateTime.TryParse(dateString, out DateTime parsedDate))
            {
                return parsedDate;
            }

            // Then try parsing with exact formats for stricter cases
            if (DateTime.TryParseExact(
                dateString,
                dateFormats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                out parsedDate))
            {
                return parsedDate;
            }

            // Handle Unix timestamp fallback (only if length is reasonable for a timestamp)
            if (long.TryParse(dateString, out long unixTimeStamp) && IsValidUnixTimestamp(unixTimeStamp))
            {
                return DateTimeOffset.FromUnixTimeSeconds(unixTimeStamp).UtcDateTime;
            }

            // Throw an exception if parsing fails
            throw new FormatException($"Unable to parse date string: {dateString}. Ensure the format matches expected patterns.");
        }

        private static bool IsValidUnixTimestamp(long timestamp)
        {
            // Check if the timestamp is within a reasonable range (1970-2038)
            return timestamp > 0 && timestamp < 2147483647;
        }

        public static DateTime ToEndOfDay(this DateTime date) => date.Date.AddDays(1).AddMilliseconds(-1);

        public static string ToMariaDbFormat(this DateTime date)
        {
            return date.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}
