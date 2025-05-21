using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.Auth;

namespace Jattac.Apps.CompanyMan.JwtTokens
{
    public interface IClaimsProvider
    {
        Task<IDictionary<string, object>> CacheClaimsAsync();

        Task<TResult?> GetClaimByNameAsync<TResult>(
            string claimName,
            Func<object, TResult> parser);
    }

    public class ClaimsProvider : IClaimsProvider
    {
        private readonly IHeaderReader headerReader;

        private readonly IRocketJwtTokenDecoder rocketJwtTokenDecoder;

        private IDictionary<string, object>? claimsCache;

        public ClaimsProvider(
            IRocketJwtTokenDecoder rocketJwtTokenDecoder,
            IHeaderReader headerReader)
        {
            this.rocketJwtTokenDecoder = rocketJwtTokenDecoder;
            this.headerReader = headerReader;
        }

        public async Task<IDictionary<string, object>> CacheClaimsAsync()
        {
            if (claimsCache == null)
            {
                var tokenString = headerReader.GetHeaderValue(HeaderNames.Token);
                claimsCache = await rocketJwtTokenDecoder.DecodeTokenAsync(tokenString);
                if (claimsCache == null)
                {
                    throw new Exception("Token could not be decoded");
                }
            }
            return claimsCache;
        }

        public async Task<TResult?> GetClaimByNameAsync<TResult>(
            string claimName,
            Func<object, TResult> parser)
        {
            var claims = await CacheClaimsAsync();

            if (claims.TryGetValue(claimName, out object? value))
            {
                if (value == default)
                {
                    return default;
                }
                else
                {
                    return parser(value);
                }
            }
            else
            {
                throw new Exception($"Token does not contain '{claimName}' claim");
            }
        }
    }
}