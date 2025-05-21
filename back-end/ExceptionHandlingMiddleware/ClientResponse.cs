using System.Text.Json.Serialization;

namespace Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware
{
    public class ClientResponse
    {
        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("isError")]
        public bool IsError { get; set; }
    }
}