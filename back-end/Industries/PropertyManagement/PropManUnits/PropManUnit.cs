using System.Collections.Immutable;
using Dapper.Contrib.Extensions;
using Jattac.Apps.CompanyMan.Industries.PropertyManagement.UnreleasedPropManUnitContacts;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnits
{
    public class PropManUnit : UserModel
    {
        public string DisplayLabel { get; set; } = string.Empty;


        [Computed]
        public ImmutableList<UnreleasedPropManUnitContact> PropManUnitContacts { get; set; } = ImmutableList<UnreleasedPropManUnitContact>.Empty;

        [Computed]
        public decimal Balance { get; set; }
    }
}