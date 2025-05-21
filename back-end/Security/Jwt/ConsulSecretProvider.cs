using Rocket.Libraries.Auth;

namespace Jattac.Apps.CompanyMan.Security.Jwt
{
    public class ConsulSecretProvider : IRocketJwtSecretProvider
    {
        public Task<string> GetSecretAsync()
        {
            return Task.FromResult("Kasuku56");
        }
    }
}