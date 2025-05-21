using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Security.Companies
{
    public class CompaniesRouter : CrudRouter<Company,string,ICompanyReader,ICompanyWriter>
    {
        

        public override string RouteName => "companies";

        protected override Expression<Func<Company, string>>? PagingField => company => company.Name;

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"get-by-id",
                httpMethod: HttpMethod.Get,
                handler: async(ICompanyReader reader, Guid id) =>
                {
                    return await reader.GetByIdAsync(id: id, showDeleted: true);
                }
            ),
            new RouteDescription(
                endpoint:"rotate-api-key",
                httpMethod: HttpMethod.Get,
                handler: async(ICompanyWriter writer, Guid companyId) =>
                {
                    return await writer.RotateApiKeyAsync(companyId);
                }
            )
        };

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (qBuilder, searchText) =>
        {
            qBuilder
                .UseTableBoundFilter<Company>()
                .WhereContains(company => company.Name, searchText);
        };
    }
}