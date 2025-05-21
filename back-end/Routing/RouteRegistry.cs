using Jattac.Apps.CompanyMan.ErrorLogFiles;
using Jattac.Apps.CompanyMan.Security.Authentication;
using Jattac.Apps.CompanyMan.Settings;
using Jattac.Apps.CompanyMan.Transactions;

namespace Jattac.Apps.CompanyMan.Routing
{
    public static class RouteRegistry
    {
        public static WebApplication RegisterCustomRoutes(this WebApplication webApplication)
        {
            var crudRoutes = CrudRouterDiscoveryUtility.DiscoverAndInitializeCrudRouters(typeof(RouteRegistry).Assembly);
            var otherRoutes = new List<CompanyManRouter>
            {
                new AuthenticationRouter(),
                new SettingsRouter(),
                new ErrorLogFilesRouter(new ErrorLogFileService()),
                new TransactionsRouter()
            };

            var combinedRoutes = crudRoutes.Concat(otherRoutes).ToArray();

            return webApplication.RegisterCompanyManRouters(combinedRoutes);
        }
        
        private static WebApplication RegisterCompanyManRouters(
            this WebApplication webApplication,
            params CompanyManRouter[] routers)
        {
            var routeGroupBuilder = webApplication.MapGroup("/").DisableAntiforgery();
            foreach (var specificRouter in routers)
            {
                specificRouter.RegisterEndpoints(routeGroupBuilder);
            }
            return webApplication;
        }
    }
}