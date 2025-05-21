using Rocket.Libraries.DatabaseIntegrator;
using Jattac.Apps.CompanyMan.HttpHeaders;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContactReleases
{
    public interface IPropManUnitContactReleasesWriter : IDatabaseWriterBase<PropManUnitContactRelease>
    {
    }

    public class PropManUnitContactReleasesWriter : DatabaseWriterBase<PropManUnitContactRelease>, IPropManUnitContactReleasesWriter
    {
        public PropManUnitContactReleasesWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IPropManUnitContactReleasesReader reader,
            IStandardHeaderReader headerReader)
            : base(databaseHelper, reader, headerReader)
        {
        }
    }
}