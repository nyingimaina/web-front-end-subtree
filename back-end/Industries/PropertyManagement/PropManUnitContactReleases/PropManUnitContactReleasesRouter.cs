using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContactReleases
{
    public class PropManUnitContactReleasesRouter : CrudRouter<PropManUnitContactRelease, DateTime, IPropManUnitContactReleasesReader, IPropManUnitContactReleasesWriter>
    {
        public override string RouteName => "prop-man-unit-contact-releases";

        protected override Expression<Func<PropManUnitContactRelease, DateTime>>? PagingField => t => t.Modified;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };
    }
}