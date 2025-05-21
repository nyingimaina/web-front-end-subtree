using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.UnreleasedPropManUnitContacts
{
    public class UnreleasedPropManUnitContactRouter : CrudRouter<UnreleasedPropManUnitContact, DateTime, IUnreleasedPropManUnitContactReader, IUnreleasedPropManUnitContactWriter>
    {
        

        public override string RouteName => "unreleased-prop-man-unit-contacts";

        protected override Expression<Func<UnreleasedPropManUnitContact, DateTime>>? PagingField => t => t.Modified;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };
    }
}