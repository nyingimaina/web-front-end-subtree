namespace Jattac.Apps.CompanyMan.Security.Roles
{
    public static class RolesServicesRegistry
    {
        public static IServiceCollection RegisterRoleServices(
            this IServiceCollection services
        )
        {
            return
                services
                    .AddScoped<IRoleWriter, RoleWriter>()
                    .AddScoped<IRoleReader, RoleReader>();
                
        }
    }
}