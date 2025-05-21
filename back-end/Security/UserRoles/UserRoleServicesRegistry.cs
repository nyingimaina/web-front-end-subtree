namespace Jattac.Apps.CompanyMan.Security.UserRoles
{
    public static class UserRoleServicesRegistry
    {
        public static IServiceCollection RegisterUserRoleServices(
            this IServiceCollection services
        )
        {
            return services
                .AddScoped<IUserRoleWriter, UserRoleWriter>()
                .AddScoped<IUserRoleReader, UserRoleReader>();
        }
    }
}