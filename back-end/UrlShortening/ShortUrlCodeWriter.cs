using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.UrlShortening
{

    public interface IShortUrlCodeWriter : IDatabaseWriterBase<ShortUrlCode> { }

    public class ShortUrlCodeWriter : DatabaseWriterBase<ShortUrlCode>, IShortUrlCodeWriter
    {
        public ShortUrlCodeWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IShortUrlCodeReader reader,
            IStandardHeaderReader standardHeaderReader)
             : base(databaseHelper, reader, standardHeaderReader)
        {
        }
    }
}