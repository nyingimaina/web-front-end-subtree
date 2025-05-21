using System.Collections.Immutable;
using Dapper.Contrib.Extensions;
using Jattac.Apps.CompanyMan.Payments;

namespace Jattac.Apps.CompanyMan.InvoiceLineItems
{
    public class InvoiceLineItem : UserModel
    {
        
        public Guid InvoiceId { get; set; }
        public Guid BillableItemId { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal Quantity { get; set; }

        [Computed]
        public string BillableItemDisplayLabel { get; set; } = string.Empty;

        [Computed]
        public decimal LineGrossTotal => UnitPrice * Quantity;

        [Computed]
        public ImmutableList<Payment> Payments { get; set; } = ImmutableList<Payment>.Empty;

        [Computed]
        public decimal PaidAmount => Payments.Sum(a => a.Amount);

        [Computed]
        public string Status
        {
            get
            {

                if (PaidAmount == LineGrossTotal)
                {
                    return PaymentStatusNames.FullyPaid;
                }
                else if (PaidAmount < LineGrossTotal && PaidAmount > 0)
                {
                    return PaymentStatusNames.PartiallyPaid;
                }
                else if (PaidAmount == 0)
                {
                    return PaymentStatusNames.Unpaid;
                }
                else
                {
                    return PaymentStatusNames.Overpaid;
                }
            }
        }
    }
}

