using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.BillableItems
{
    public class BillableItem : UserModel
    {
        public string DisplayLabel { get; set; } = string.Empty;
        
        [StringIsInSet(
            comparisonType: StringComparison.OrdinalIgnoreCase,
            "Customer",
            "Supplier"
        )]
        public string InvoiceType { get; set; } = string.Empty;
    }
}
