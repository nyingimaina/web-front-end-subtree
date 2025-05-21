namespace Jattac.Apps.CompanyMan.Timezones
{
    public class TimezoneOffsetMiddleware
    {
        public const string TimezoneOffsetMinutes = "x-timezone-offset-minutes";
        private readonly RequestDelegate next;

        public TimezoneOffsetMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var timezoneOffset = context.Request.Headers[TimezoneOffsetMinutes].FirstOrDefault();
            if (string.IsNullOrEmpty(timezoneOffset) ||
                !IsValidTimezoneOffset(timezoneOffset))
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsync("Invalid or missing timezone offset.");
                return;
            }
            else
            {
                await next(context);
            }
        }
        
        private bool IsValidTimezoneOffset(string timezoneOffset)
        {
            return int.TryParse(timezoneOffset, out int offset) && offset >= -720 && offset <= 840;
        }
    }
}