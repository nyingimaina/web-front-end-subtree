/**
 * Represents a template for repeating invoices.
 */
export default interface IInvoiceRepetitionTemplate {
  /**
   * Unique identifier for the invoice repetition template.
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
   * Company ID associated with this repetition template.
   */
  companyId: string;

  /**
   * User ID associated with the creation or modification of this template.
   */
  userId: string;

  /**
   * Invoice ID that this repetition template is associated with.
   */
  invoiceId: string;

  /**
   * Day of the month on which this repetition occurs.
   */
  day: number;
}
