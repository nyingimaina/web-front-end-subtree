using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContactReleases
{
    public interface IPropManUnitContactReleasesReader : IDatabaseReaderBase<PropManUnitContactRelease>
    {
    }

    public class PropManUnitContactReleasesReader : DatabaseReaderBase<PropManUnitContactRelease>, IPropManUnitContactReleasesReader
    {
        public PropManUnitContactReleasesReader(IDatabaseHelper<Guid> databaseHelper) : base(databaseHelper)
        {
        }
    }
}