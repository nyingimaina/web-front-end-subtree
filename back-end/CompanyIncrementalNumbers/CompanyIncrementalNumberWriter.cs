using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.CompanyIncrementalNumbers
{
    public interface ICompanyIncrementalNumberWriter : IDatabaseWriterBase<CompanyIncrementalNumber>
    {

    }
    public class CompanyIncrementalNumberWriter : DatabaseWriterBase<CompanyIncrementalNumber> ,ICompanyIncrementalNumberWriter
    {
        public CompanyIncrementalNumberWriter(
            IDatabaseHelper<Guid> databaseHelper,
            ICompanyIncrementalNumberReader reader,
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader, headerReader)
        {
        }
    }
}