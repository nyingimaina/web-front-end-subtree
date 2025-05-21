namespace Jattac.Apps.CompanyMan.Security.Companies
{
    public static class CompanyServicesRegistry
    {
        public static IServiceCollection RegisterCompanyServices(this IServiceCollection services)
        {
            return services
                .AddScoped<ICompanyReader, CompanyReader>()
                .AddScoped<ICompanyWriter, CompanyWriter>();
        }
    }
}