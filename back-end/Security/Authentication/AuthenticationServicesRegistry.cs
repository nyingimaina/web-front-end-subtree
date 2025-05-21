namespace Jattac.Apps.CompanyMan.Security.Authentication
{
    public static class AuthenticationServicesRegistry
    {
        public static IServiceCollection RegisterAuthenticationServices(
            this IServiceCollection services
        )
        {
            return services
                .AddScoped<IPasswordHelper, PasswordHelper>()
                .AddScoped<IAutenticator, Autenticator>();
        }
    }
}