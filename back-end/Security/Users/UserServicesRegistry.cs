namespace Jattac.Apps.CompanyMan.Security.Users
{
    public static class UserServicesRegistry
    {
        public static IServiceCollection RegisterUserServices(
            this IServiceCollection services
        )
        {
            return services.
                AddScoped<IUserCreator, UserCreator>()
                .AddScoped<IUserReader, UserReader>()
                .AddScoped<IUserWriter, UserWriter>()
                .AddScoped<IUserRolesHandler, UserRolesHandler>();
        }
    }
}