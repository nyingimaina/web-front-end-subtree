using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jattac.Apps.CompanyMan.HttpQueryParams
{
    public interface IStandardHttpQueryParamReader
    {
        Guid CompanyId { get; }
    }
    public class StandardHttpQueryParamReader : IStandardHttpQueryParamReader
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public StandardHttpQueryParamReader(
            IHttpContextAccessor httpContextAccessor
        )
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public Guid CompanyId
        {
            get
            {
                var companyId = httpContextAccessor?.HttpContext?.Request.Query["companyId"].FirstOrDefault();
                if (!string.IsNullOrEmpty(companyId))
                {
                    return new Guid(companyId);
                }
                return Guid.Empty;
            }
        }
    }
}