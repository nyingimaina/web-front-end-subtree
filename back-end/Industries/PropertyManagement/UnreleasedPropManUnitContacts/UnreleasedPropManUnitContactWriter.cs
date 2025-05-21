using Rocket.Libraries.DatabaseIntegrator;
using Jattac.Apps.CompanyMan.HttpHeaders;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.UnreleasedPropManUnitContacts
{
    public interface IUnreleasedPropManUnitContactWriter : IDatabaseWriterBase<UnreleasedPropManUnitContact>
    {
    }

    public class UnreleasedPropManUnitContactWriter : DatabaseWriterBase<UnreleasedPropManUnitContact>, IUnreleasedPropManUnitContactWriter
    {
        

        public UnreleasedPropManUnitContactWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IUnreleasedPropManUnitContactReader reader,
            IStandardHeaderReader headerReader)
            : base(databaseHelper, reader, headerReader)
        {
            
        }

        
    }
}