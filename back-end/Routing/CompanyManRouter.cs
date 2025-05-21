using Microsoft.OpenApi.Models;

namespace Jattac.Apps.CompanyMan.Routing
{
    public abstract class CompanyManRouter
    {
        public abstract string RouteName { get; }

        public abstract HashSet<RouteDescription> RouteDescriptions { get; }

        public RouteGroupBuilder RegisterEndpoints(RouteGroupBuilder routeGroupBuilder)
        {
            foreach (var specificRouteDescription in RouteDescriptions)
            {
                if (specificRouteDescription.HttpMethod == default)
                {
                    throw new ArgumentException($"HttpMethod has not been set for api/{RouteName}/{specificRouteDescription.Endpoint}");
                }

                
                // Use pattern matching with switch expression
                var description = specificRouteDescription.HttpMethod switch
                {
                    HttpMethod method when method == HttpMethod.Get => routeGroupBuilder.MapGet($"api/{RouteName}/{specificRouteDescription.Endpoint}", specificRouteDescription.Handler),
                    HttpMethod method when method == HttpMethod.Post => routeGroupBuilder.MapPost($"api/{RouteName}/{specificRouteDescription.Endpoint}", specificRouteDescription.Handler),
                    HttpMethod method when method == HttpMethod.Put => routeGroupBuilder.MapPut($"api/{RouteName}/{specificRouteDescription.Endpoint}", specificRouteDescription.Handler),
                    HttpMethod method when method == HttpMethod.Delete => routeGroupBuilder.MapDelete($"api/{RouteName}/{specificRouteDescription.Endpoint}", specificRouteDescription.Handler),
                    HttpMethod method when method == HttpMethod.Patch => routeGroupBuilder.MapPatch($"api/{RouteName}/{specificRouteDescription.Endpoint}", specificRouteDescription.Handler),
                    HttpMethod method when method == HttpMethod.Head => routeGroupBuilder.MapMethods($"api/{RouteName}/{specificRouteDescription.Endpoint}", new[] { "HEAD" }, specificRouteDescription.Handler),
                    HttpMethod method when method == HttpMethod.Options => routeGroupBuilder.MapMethods($"api/{RouteName}/{specificRouteDescription.Endpoint}", new[] { "OPTIONS" }, specificRouteDescription.Handler),
                    _ => throw new NotSupportedException($"HTTP method {specificRouteDescription.HttpMethod.Method} is not supported.")
                };

                if (specificRouteDescription.HideInApiDocumentation == false)
                {
                    description.WithOpenApi(op =>
    {
        op.Summary = specificRouteDescription.Summary;
        op.Description = specificRouteDescription.Description;

        // Configure response type schema directly
        if (specificRouteDescription.ResponseType != null)
        {
            op.Responses["200"] = new OpenApiResponse
            {
                Description = "Success",
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["application/json"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema { Reference = new OpenApiReference { Type = ReferenceType.Schema, Id = specificRouteDescription.ResponseType.Name } }
                    }
                }
            };
        }

        // Configure request body schema if RequestType is provided
        if (specificRouteDescription.RequestType != null)
        {
            op.RequestBody = new OpenApiRequestBody
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["application/json"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema { Reference = new OpenApiReference { Type = ReferenceType.Schema, Id = specificRouteDescription.RequestType.Name } }
                    }
                }
            };
        }
        return op;
    });
                }
            }

            return routeGroupBuilder;
        }

    }
}