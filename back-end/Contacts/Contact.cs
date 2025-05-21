using System.Collections.Immutable;
using Dapper.Contrib.Extensions;
using Jattac.Apps.CompanyMan.ContactAddresses;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.Contacts
{
    public class Contact : UserModel
    {
        public virtual string DisplayLabel { get; set; } = string.Empty;

        [StringIsInSet(
            comparisonType: StringComparison.OrdinalIgnoreCase,
            "Supplier",
            "Customer"
        )]
        [StringIsNonNullable(displayLabel:"Contact Type")]
        public virtual string ContactType { get; set; } = string.Empty;

        [Computed]
        public ImmutableList<ContactAddress> ContactAddresses { get; set; } = ImmutableList<ContactAddresses.ContactAddress>.Empty;
    }
}
