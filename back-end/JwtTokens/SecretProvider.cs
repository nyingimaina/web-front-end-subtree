using Microsoft.Extensions.Options;
using Rocket.Libraries.Auth;

namespace Jattac.Apps.CompanyMan.JwtTokens
{
    public class SecretProvider : IRocketJwtSecretProvider
    {
        private readonly string secret;

        public SecretProvider(
            IOptions<JwtSecret> options)
        {
            secret = options.Value.Secret;
        }

        public Task<string> GetSecretAsync()
        {
            return Task.FromResult(secret);
        }
    }
}