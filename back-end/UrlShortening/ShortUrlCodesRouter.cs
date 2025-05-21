using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.UrlShortening
{
    public class ShortUrlCodesRouter : CrudRouter<ShortUrlCode, DateTime, IShortUrlCodeReader, IShortUrlCodeWriter>
    {
        public override string RouteName => "short-codes";

        protected override Expression<Func<ShortUrlCode, DateTime>>? PagingField => t => t.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        public override HashSet<RouteDescription> RouteDescriptions => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "get-by-code",
                httpMethod: HttpMethod.Get,
                handler: async (IShortUrlCodeReader reader, string code) => await reader.GetByCodeAsync(code)
            )
        };
    }
}