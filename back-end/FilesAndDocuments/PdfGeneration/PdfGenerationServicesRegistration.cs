using DinkToPdf;
using DinkToPdf.Contracts;

namespace Jattac.Apps.CompanyMan.FilesAndDocuments.PdfGeneration
{
    public static class PdfGenerationServicesRegistration
    {
        public static IServiceCollection RegisterPdfGenerationServices(this IServiceCollection services)
        {
            return services
                .AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()))
                .AddScoped<IPdfGenerator, PdfGenerator>()
                .AddScoped<IDinkPdfGenerator, DinkPdfGenerator>();
        }
    }
}