namespace Jattac.Apps.CompanyMan.FilesAndDocuments.Templates
{
    public static class TemplateServicesRegistrar
    {
        public static IServiceCollection RegisterTemplateServices(this IServiceCollection services)
        {
            return services
                .AddScoped<ITemplateReader, TemplateReader>();
        }
    }
}