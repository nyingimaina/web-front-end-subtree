using System.Text.Json.Serialization;
using Jattac.Apps.CompanyMan.Security.Users;
using Dapper.Contrib.Extensions;

namespace Jattac.Apps.CompanyMan.Security.Authentication
{
    public class AuthenticationResult : User
    {
        [JsonIgnore]
        public override string Password { get => base.Password; set => base.Password = value; }

        [Computed]
        public Guid UserId => Id;
    }
}