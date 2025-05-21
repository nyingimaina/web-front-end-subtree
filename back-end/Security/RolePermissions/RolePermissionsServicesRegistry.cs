namespace Jattac.Apps.CompanyMan.Security.RolePermissions
{
    public static class RolePermissionsServicesRegistry
    {
        public static IServiceCollection RegisterRolePermissionsServices(
            this IServiceCollection services
        )
        {
            return services
                .AddScoped<IRolePermissionReader, RolePermissionReader>()
                .AddScoped<IRolePermissionWriter, RolePermissionWriter>();
        }
    }
}