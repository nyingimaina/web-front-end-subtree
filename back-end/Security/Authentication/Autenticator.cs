using Jattac.Apps.CompanyMan.Security.Users;
using Rocket.Libraries.DatabaseIntegrator;
using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.Utils;

namespace Jattac.Apps.CompanyMan.Security.Authentication
{
    public interface IAutenticator
    {
        Task<AuthenticationResult> AuthenticateAsync(
            AuthenticationRequest authenticationRequest
        );
    }

    public class Autenticator : IAutenticator
    {
        private readonly IDatabaseHelper<Guid> databaseHelper;
        private readonly IPasswordHelper passwordHelper;
        private readonly IUserCreator userCreator;
        private readonly IUserReader userReader;

        public Autenticator(
            IDatabaseHelper<Guid> databaseHelper,
            IPasswordHelper passwordHelper,
            IUserCreator userCreator,
            IUserReader userReader
        )
        {
            this.databaseHelper = databaseHelper;
            this.passwordHelper = passwordHelper;
            this.userCreator = userCreator;
            this.userReader = userReader;
        }

        public async Task<AuthenticationResult> AuthenticateAsync(
            AuthenticationRequest authenticationRequest
        )
        {
            if(authenticationRequest == null)
            {
                throw new ArgumentNullException(nameof(authenticationRequest));
            }

            var user = await userReader.GetByEmailAsync(email: authenticationRequest.Email, preservePassword: true);
            
            if(user == null)
            {
                if(authenticationRequest.Email.Equals(User.SuperAdminEmail,StringComparison.InvariantCultureIgnoreCase))
                {
                    var userCreateResponse = await userCreator.CreateRootUser(
                        password: authenticationRequest.Password
                    );
                    if(userCreateResponse.Id != default)
                    {
                        return await AuthenticateAsync(authenticationRequest);
                    }
                    else
                    {
                        throw new ClientVisibleInformationException("Unable to initialize users");
                    }
                }
                throw new ClientVisibleInformationException($"Invalid email or password");
            }

            var passwordsMatch = passwordHelper.VerifyPassword(
                enteredPassword: authenticationRequest.Password,
                storedHash: user.Password
            );

            if(passwordsMatch == false)
            {
                throw new ClientVisibleInformationException($"Invalid email or password");
            }

            var authenticationResult = PropertyMapper.MapProperties(user, new AuthenticationResult());
            return authenticationResult;
        }
    }
}