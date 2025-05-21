using Jattac.Apps.CompanyMan.ApiKeys;
using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.Timezones;

namespace Jattac.Apps.CompanyMan
{
    public static class MiddlewareConfigurator
    {
        public static WebApplication ConfigureMiddleware(this WebApplication app)
        {
            app
                .UseCors("AllowAll");
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            
            app.UseMiddleware<TimezoneOffsetMiddleware>();
            app.UseMiddleware<CustomExceptionHandlerMiddleWare>();
            app.UseMiddleware<DatabaseTransactionMiddleware>();
            app.UseMiddleware<ApiKeyAuthenticationMiddleware>();

            app.UseRouting();
#pragma warning disable ASP0014 // Suggest using top level route registrations
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
#pragma warning restore ASP0014 // Suggest using top level route registrations

            return app;
        }
    }
}