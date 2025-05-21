namespace Jattac.Apps.CompanyMan.Echos
{
    public static class EchoRoute
    {
        private const string RouteName = "/echo";
        public static WebApplication RegisterEchoEndpoints(this WebApplication webApplication)
        {
            webApplication
                .MapGet(RouteName, (string thing) =>
                {
                    return thing;
                })
                .WithName("echo")
                .WithOpenApi();
            return webApplication;
        }
    }
}