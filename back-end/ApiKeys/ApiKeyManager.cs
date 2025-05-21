using System.Security.Cryptography;

namespace Jattac.Apps.CompanyMan.ApiKeys
{
    public interface IApiKeyManager
    {
        string GenerateApiKey(int length = 32);
    }

    public class ApiKeyManager : IApiKeyManager
    {
        public  string GenerateApiKey(int length = 32)
        {
            byte[] randomBytes = new byte[length];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            return Convert.ToBase64String(randomBytes)
                .Replace("+", "")
                .Replace("/", "")
                .Replace("=", ""); // Remove special characters to keep it URL-safe
        }
    }

}