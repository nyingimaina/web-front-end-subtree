using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Security.Users
{
    public class UserRouter : CrudRouter<User,string, IUserReader, IUserWriter>
    {
        

        public override string RouteName => "users";

        protected override Expression<Func<User, string>>? PagingField => user => user.Email;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (qBuilder, searchText) =>
        {
            qBuilder
                .UseTableBoundFilter<User>()
                .WhereContains(user => user.Email, searchText);
        };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "get-by-company-id",
                httpMethod: HttpMethod.Get,
                handler: async (IUserReader userReader, Guid companyId) =>
                {
                    return await userReader.GetByCompanyIdAsync(
                        companyId: companyId,
                        preservePassword: false);
                }),
                new RouteDescription(
                    endpoint:"manage",
                    httpMethod: HttpMethod.Post,
                    handler: async(IUserWriter userWriter, User user) =>
                    {
                        return await userWriter.ManageAsync(user);
                    }
                ),
                new RouteDescription(
                    endpoint:"toggle-deletion",
                    httpMethod: HttpMethod.Get,
                    handler: async (IUserWriter userWriter, Guid userId, bool deleted) =>
                    {
                        return await userWriter.ToggleDeletionAsync(
                            userId: userId,
                            deleted: deleted
                        );
                    }
                )
        };
    }
}