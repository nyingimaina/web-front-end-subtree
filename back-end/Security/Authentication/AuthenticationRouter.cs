using Jattac.Apps.CompanyMan.Routing;

namespace Jattac.Apps.CompanyMan.Security.Authentication
{
    public class AuthenticationRouter : CompanyManRouter
    {
        public override string RouteName => "authentication";

        public override HashSet<RouteDescription> RouteDescriptions => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"sign-in",
                httpMethod: HttpMethod.Post,
                async (IAutenticator authenticator, AuthenticationRequest authenticationRequest) =>
                {
                    return await authenticator.AuthenticateAsync(authenticationRequest);
                },
                requestType: typeof(AuthenticationRequest),
                responseType: typeof(AuthenticationResult),
                summary:"Exposes Sign In Functionality",
                description:$"Post a payload of {nameof(AuthenticationRequest)} to request the system to grant you access. On success returns {nameof(AuthenticationResult)}"),
        };
    }
}