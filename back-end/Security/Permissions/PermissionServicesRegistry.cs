namespace Jattac.Apps.CompanyMan.Security.Permissions
{
    public static class PermissionServicesRegistry
    {
        public static IServiceCollection RegisterPermissionsServices(
            this IServiceCollection services
        )
        {
            return services
                .AddScoped<IPermissionReader, PermissionReader>()
                .AddScoped<IPermissionWriter, PermissionWriter>();
        }
    }
}