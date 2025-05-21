/**
 * Represents an individual line item within an invoice.
 */
export default interface IInvoiceLineItem {
  /**
   * Unique identifier for the invoice line item.
   */
  id: string;

  /**
   * Timestamp of when the record was created.
   */
  created: string;

  /**
   * Timestamp of the last modification.
   */
  modified: string;

  /**
   * Indicates whether the record has been marked as deleted.
   */
  deleted: boolean;

  /**
   * ID of the user who created or modified the record.
   */
  userId: string;

  /**
   * ID of the invoice to which this line item belongs.
   */
  invoiceId: string;

  /**
   * Unit price of the billable item.
   */
  unitPrice: number;

  /**
   * Company ID associated with this invoice line item.
   */
  companyId: string;

  /**
   * ID of the billable item being charged in this line.
   */
  billableItemId: string;

  /**
   * Quantity of the billable item being charged.
   */
  quantity: number;

  billableItemDisplayLabel: string;

  lineGrossTotal: number;

  paidAmount: number;

  status: string;
}
