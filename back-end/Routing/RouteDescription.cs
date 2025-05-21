namespace Jattac.Apps.CompanyMan.Routing
{
    public class RouteDescription
    {
        public RouteDescription(
            string endpoint,
            HttpMethod httpMethod,
            Delegate handler,            
            bool hideInApiDocumentation = false,
            string? summary = null,
            string? description = null,
            Type? requestType = null,
            Type? responseType = null
        )
        {
            Endpoint = endpoint;
            HideInApiDocumentation = hideInApiDocumentation;
            HttpMethod = httpMethod;
            Handler = handler;
            Summary = summary;
            Description = description;
            RequestType = requestType;
            ResponseType = responseType;
        }


        public string? Summary { get; private set; }
        public string? Description { get; private set; }
        public string Endpoint { get; private set; }

        public bool HideInApiDocumentation { get; private set; }

        public HttpMethod HttpMethod { get; private set; }

        public Delegate Handler { get; private set; }

        public Type? RequestType { get; private set; }
        public Type? ResponseType { get; private set; }

        public override bool Equals(object? obj)
        {
            if (obj is RouteDescription other)
            {
                return string.Equals(Endpoint, other.Endpoint, StringComparison.OrdinalIgnoreCase);
            }
            return false;
        }

        public override int GetHashCode()
        {
            return Endpoint?.ToLowerInvariant().GetHashCode() ?? 0;
        }
    }

}