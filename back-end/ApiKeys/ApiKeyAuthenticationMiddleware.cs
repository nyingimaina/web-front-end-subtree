using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.Companies;
using Jattac.Apps.CompanyMan.Security.Users;

namespace Jattac.Apps.CompanyMan.ApiKeys
{
    public class ApiKeyAuthenticationMiddleware
    {
        private readonly RequestDelegate next;

        public ApiKeyAuthenticationMiddleware(
            RequestDelegate next
        )
        {
            this.next = next;
        }


        public async Task InvokeAsync(
            HttpContext context,
            ICompanyReader companyReader,
            IStandardHeaderReader standardHeaderReader,
            IUserOfApiHandler userOfApiHandler)
        {
            var apiKey = standardHeaderReader.ApiKey;
            var hasApiKey = !string.IsNullOrEmpty(apiKey);
            if (hasApiKey)
            {
                var company = await companyReader.GetByApiKeyAsync(apiKey: apiKey);
                if (company == null)
                {
                    throw new Exception("Invalid api key");
                }
                var user = await userOfApiHandler.GetByCompanyIdAsync(companyId: company.Id);
                if (user == null)
                {
                    throw new Exception("Could not find user for api key");
                }
                context.Request.Headers.Append(HeaderNames.UserId, user.Id.ToString());
                context.Request.Headers.Append(HeaderNames.CompanyId, company.Id.ToString());
            }

            await next(context);
        }
    }
}