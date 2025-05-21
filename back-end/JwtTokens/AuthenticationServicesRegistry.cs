namespace Jattac.Apps.CompanyMan.JwtTokens
{
    public static class AuthenticationServicesRegistry
    {
        public static IServiceCollection RegisterAuthenticationService(this IServiceCollection services)
        {
            return services
                .AddScoped<IClaimsProvider, ClaimsProvider>();
        }
    }
}