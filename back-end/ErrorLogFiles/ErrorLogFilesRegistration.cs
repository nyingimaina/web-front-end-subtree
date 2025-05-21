namespace Jattac.Apps.CompanyMan.ErrorLogFiles
{
    public static class ErrorLogFilesRegistration
    {
        public static IServiceCollection RegisterErrorLogFiles(this IServiceCollection services)
        {
            services.AddScoped<IErrorLogFileService, ErrorLogFileService>();
            services.AddScoped<ErrorLogFilesRouter>();

            return services;
        }
    }
}
