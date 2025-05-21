namespace Jattac.Apps.CompanyMan.DocumentGeneration
{
    public static class TemplateCompilerServicesRegistry
    {
        public static IServiceCollection RegisterDocumentGenerationServices(this IServiceCollection services)
        {
            return services
                .AddScoped<ITemplateCompiler, TemplateCompiler>();
        }
    }
}