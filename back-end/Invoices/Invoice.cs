using System.Collections.Immutable;
using Dapper.Contrib.Extensions;
using Jattac.Apps.CompanyMan.InvoiceLineItems;
using Jattac.Apps.CompanyMan.InvoiceRepetitionTemplates;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.Invoices
{
    public class Invoice : UserModel
    {

        public Guid ContactId { get; set; }

        [StringIsNonNullable(displayLabel:"Invoice Number")]
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime Dated { get; set; }

        [StringIsInSet(
            comparisonType: StringComparison.OrdinalIgnoreCase,
            "Customer",
            "Supplier"
        )]
        [StringIsNonNullable(displayLabel: "Invoice Type")]
        public string InvoiceType { get; set; } = string.Empty;

        public string Comment { get; set; } = string.Empty;
        public string Currency { get; set; } = "Ksh"; // Default value

        [Computed]
        public string CompanyDisplayLabel { get; set; } = string.Empty;


        public static string GetPaddedInvoiceNumber(string invoiceNumber) => invoiceNumber
           .ToString()
           .PadLeft(4, '0');

        [Computed]
        public string InvoiceNumberPadded => GetPaddedInvoiceNumber(InvoiceNumber);

        [Computed]
        public string ContactDisplayLabel { get; set; } = string.Empty;

        [Computed]
        public ImmutableList<InvoiceLineItem> InvoiceLineItems { get; set; } = ImmutableList<InvoiceLineItem>.Empty;

        [Computed]
        public decimal GrossTotal => InvoiceLineItems.Sum(a => a.LineGrossTotal);

        [Computed]
        public decimal PaidAmount => InvoiceLineItems.Sum(a => a.PaidAmount);

        [Computed]
        public decimal Balance => GrossTotal - PaidAmount;

        [Computed]
        public string Status
        {
            get
            {
                if (PaidAmount == GrossTotal)
                {
                    return PaymentStatusNames.FullyPaid;
                }
                else if (PaidAmount == 0 && GrossTotal > 0)
                {
                    return PaymentStatusNames.Unpaid;
                }
                else if (PaidAmount < GrossTotal)
                {
                    return PaymentStatusNames.PartiallyPaid;
                }
                else if (PaidAmount > GrossTotal)
                {
                    return PaymentStatusNames.Overpaid;
                }
                else
                {
                    return "Unclear";
                }
            }
        }

        [Computed]
        public InvoiceRepetitionTemplate InvoiceRepetitionTemplate { get; set; } = new InvoiceRepetitionTemplate();

        public bool BadDebt { get; set; } 

        
    
    }
}