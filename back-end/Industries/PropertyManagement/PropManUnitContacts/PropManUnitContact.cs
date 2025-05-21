using Dapper.Contrib.Extensions;
using Jattac.Apps.CompanyMan.Contacts;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContacts
{
    public class PropManUnitContact : Contact
    {
        public Guid PropManUnitId { get; set; }

        public Guid ContactId { get; set; }

        [StringIsInSet(
            comparisonType: StringComparison.Ordinal,
            PropManUnitContactTypeNames.Owner,
            PropManUnitContactTypeNames.Tenant
        )]
        public string PropManUnitContactType { get; set; } = string.Empty;

        [Computed]
        public override string ContactType { get => base.ContactType; set => base.ContactType = value; }

        [Computed]
        public override string DisplayLabel { get => base.DisplayLabel; set => base.DisplayLabel = value; }
        
    }
}