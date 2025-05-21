namespace Jattac.Apps.CompanyMan.JwtTokens
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate next;

        public AuthenticationMiddleware(
            RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(
            HttpContext context,
            IClaimsProvider claimsProvider)
        {
            var isOptions = context.Request.Method.ToUpper() == "OPTIONS";
            if (isOptions == false)
            {
                try
                {
                    var whiteListedPaths = new string[] { "/swagger/","/api/v1/ErrorLogging/" };
                    string queryPath = context.Request.Path.Value ?? string.Empty;
                    var isWhiteListed = whiteListedPaths.Any(a => queryPath.StartsWith(a, StringComparison.OrdinalIgnoreCase));
                    if(isWhiteListed == false)
                    {
                        await claimsProvider.CacheClaimsAsync();
                    }
                }
                catch (Exception e)
                {
                    Program.ErrorLogger.Log(e, "Error reading claims");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized Please Sign In Again");
                    return;
                }
            }
            await next(context);
        }
    }
}