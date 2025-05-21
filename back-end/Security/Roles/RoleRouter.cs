using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Security.Roles
{
    public class RoleRouter : CrudRouter<Role, string, IRoleReader, IRoleWriter>
    {
        

        public override string RouteName => "roles";

        protected override Expression<Func<Role, string>>? PagingField => role => role.RoleDisplayLabel;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };
    }
}