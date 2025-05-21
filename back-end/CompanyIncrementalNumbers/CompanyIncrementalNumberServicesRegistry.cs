namespace Jattac.Apps.CompanyMan.CompanyIncrementalNumbers
{
    public static class CompanyIncrementalNumberServicesRegistry
    {
        public static IServiceCollection RegisterCompanyIncrementalNumberServices(
            this IServiceCollection services
        )
        {
            return services
                .AddScoped<ICompanyIncrementalNumberReader, CompanyIncrementalNumberReader>()
                .AddScoped<ICompanyIncrementalNumberWriter, CompanyIncrementalNumberWriter>()
                .AddScoped<ICompanyIncrementalNumberProvider, CompanyIncrementalNumberProvider>();
        }
    }
}