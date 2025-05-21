namespace Jattac.Apps.CompanyMan.UrlShortening
{
    using System;
    using System.Security.Cryptography;
    using System.Text;
    using Jattac.Apps.CompanyMan.HttpHeaders;


    public interface IUrlShortener
    {
        Task<string> GenerateAndSaveUniqueCode(
            string url,
            int minLength = 6,
            int maxLength = 15);
    }
    public class UrlShortener : IUrlShortener
    {
        private const string Base36Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private readonly IShortUrlCodeReader shortUrlCodeReader;
        private readonly IStandardHeaderReader standardHeaderReader;
        private readonly IShortUrlCodeWriter shortUrlCodeWriter;

        public UrlShortener(
            IShortUrlCodeReader shortUrlCodeReader,
            IStandardHeaderReader standardHeaderReader,
            IShortUrlCodeWriter shortUrlCodeWriter
        )
        {
            this.shortUrlCodeReader = shortUrlCodeReader;
            this.standardHeaderReader = standardHeaderReader;
            this.shortUrlCodeWriter = shortUrlCodeWriter;
        }

        

        public async Task<string> GenerateAndSaveUniqueCode(
            string url,
            int minLength = 6,
            int maxLength = 15)
        {
            // Combine URL + salt and hash
            var salt = standardHeaderReader.CompanyId.ToString();
            using var sha256 = SHA256.Create();
            byte[] hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(salt + "::" + url));

            // Convert to a large integer
            var value = new System.Numerics.BigInteger(hash, isUnsigned: true, isBigEndian: true);

            string base36 = Base36Encode(value);

            // Try increasing lengths until we find a unique code
            for (int len = minLength; len <= maxLength; len++)
            {
                string code = base36.Substring(0, len);
                var existingVersion = await shortUrlCodeReader.GetByCodeAsync(code);
                if (existingVersion == null)
                {
                    var saveResponse = await shortUrlCodeWriter.UpsertAsync(new ShortUrlCode
                    {
                        Url = url,
                        Code = code
                    });
                    saveResponse.FailReportClientVisibleMessagesIfAny();
                    return code;
                }
                else if(existingVersion.Url == url)
                {
                    return code;
                }
                
            }

            throw new Exception("Unable to generate a unique code within maxLength constraint.");
        }

        

        private string Base36Encode(System.Numerics.BigInteger value)
        {
            var sb = new StringBuilder();
            while (value > 0)
            {
                var remainder = (int)(value % 36);
                sb.Insert(0, Base36Chars[remainder]);
                value /= 36;
            }
            return sb.ToString();
        }
    }

}