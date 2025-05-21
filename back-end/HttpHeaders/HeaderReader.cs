namespace Jattac.Apps.CompanyMan.HttpHeaders
{
    public interface IHeaderReader
    {
        string GetHeaderValue(string headerName, bool throwExceptionIfHeaderMissing = true);
    }

    public class HeaderReader : IHeaderReader
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public HeaderReader(
            IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public string GetHeaderValue(string headerName, bool throwExceptionIfHeaderMissing = true)
        {
            var headers = httpContextAccessor.HttpContext?.Request.Headers;

            // Check if the header name is specified
            if (string.IsNullOrEmpty(headerName))
            {
                throw new ArgumentException("No header name was specified.", nameof(headerName));
            }

            // Check if headers exist
            if (throwExceptionIfHeaderMissing && (headers == null || headers.Count == 0))
            {
                throw new InvalidOperationException("No headers were passed.");
            }

            // Check if the specified header exists
            if (throwExceptionIfHeaderMissing && !headers!.ContainsKey(headerName))
            {
                throw new KeyNotFoundException($"Could not find header called '{headerName}'.");
            }

            // Return the header value if it exists, or an empty string otherwise
            return headers != null && headers.TryGetValue(headerName, out var headerValue) 
                ? headerValue.ToString() 
                : string.Empty;
        }

    }
}