import { Component, ReactNode } from "react";
import styles from "../Styles/InvoiceDocument.module.css";
import InvoiceDocumentLogic from "../State/InvoiceDocumentLogic";
import Formatting from "@/Formatting";
import IInvoiceLineItem from "@/InvoiceLineItems/Data/IInvoiceLineItem";

export interface InvoiceDocumentProps {
  invoiceId: string;
}

const logic = new InvoiceDocumentLogic();

// Forwarding ref to use with react-to-print
export class InvoiceDocument extends Component<InvoiceDocumentProps> {
  private get paymentTerms(): string {
    const item =
      logic.repository.footerSettings.find(
        (setting) => setting.key === "PaymentInstructions"
      )?.value ?? "";
    const lines = item.split("\n");
    lines.push(
      `Please include invoice number ${logic.model.invoiceNumberPadded} as payment reference`
    );
    return this.getMultilineText(lines);
  }

  private get remarks(): string {
    const item =
      logic.repository.footerSettings.find(
        (setting) => setting.key === "FooterRemarks"
      )?.value ?? "";
    const lines = item.split("\n");
    return this.getMultilineText(lines);
  }

  private getMultilineText(lines: string[]): string {
    let list = "";
    for (let i = 0; i < lines.length; i++) {
      list += `${lines[i]}<br/>`;
    }
    return list;
  }

  private get bill(): ReactNode {
    const invoice = logic.model;
    const termsOfPayment = this.paymentTerms;
    return (
      <div className={styles.billContainer}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1>{invoice.companyDisplayLabel}</h1>
            <div>
              <h1>Invoice</h1>
              <p>Invoice Number: {invoice.invoiceNumberPadded}</p>
            </div>
          </div>
          <div id="billContent">
            <div className={styles.section}>
              <h2>Bill To</h2>
              <p>{invoice.contactDisplayLabel}</p>
              {/* <p>
                {Formatting.formatPhoneNumber({ phoneNumber: invoice.billToPhoneNumber })}
              </p> */}
            </div>
            <div className={styles.section}>
              <h2>Invoice Details</h2>
              <p>Invoice Date: {Formatting.toDDMMMYYYY(invoice.dated)}</p>
              <p>Currency: {invoice.currency}</p>
              {/* <p>Billing Period: {invoice.billingPeriod}</p> */}
              {/* <p>Due Date: {formatToDateOnly(invoice.dueOn)}</p> */}

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>
                      <div className={styles.rightAlign}>Quantity</div>
                    </th>
                    <th>
                      <div className={styles.rightAlign}>Unit Cost</div>
                    </th>
                    <th>
                      <div className={styles.rightAlign}>Total</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoiceLineItems.map(
                    (item: IInvoiceLineItem, index: number) => (
                      <tr key={index}>
                        <td>{item.billableItemDisplayLabel}</td>
                        <td>
                          <div className={styles.rightAlign}>
                            {item.quantity}
                          </div>
                        </td>
                        <td>
                          <div className={styles.rightAlign}>
                            {Formatting.toMoney({
                              amount: item.unitPrice,
                            })}
                          </div>
                        </td>
                        <td>
                          <div className={styles.rightAlign}>
                            {Formatting.toMoney({
                              amount: item.lineGrossTotal,
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                  <tr>
                    <td colSpan={3} className={styles.total}>
                      Total:
                    </td>
                    <td className={styles.total}>
                      <div className={styles.rightAlign}>
                        {Formatting.toMoney({
                          amount: invoice.grossTotal,
                        })}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.thankYou}>
              {
                logic.repository.footerSettings.find(
                  (a) => a.key === "FooterTitle"
                )?.value
              }
            </div>
            <div className={styles.paymentInfo}>
              {termsOfPayment && (
                <div className={styles.paymentTerms}>
                  <h3>Payment Information</h3>
                  <div
                    className={styles.footerNote}
                    dangerouslySetInnerHTML={{ __html: termsOfPayment }}
                  />
                </div>
              )}
              <div className={styles.footerNote}>
                <div dangerouslySetInnerHTML={{ __html: this.remarks }} />
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.fetchDataAsync({
      invoiceId: this.props.invoiceId,
    });
    if (logic.model && logic.model.invoiceNumberPadded) {
      window.document.title = `${logic.model.companyDisplayLabel}: Invoice ${logic.model.invoiceNumberPadded}`;
    }
  }

  render() {
    if (logic.repository.initialized) {
      return this.bill;
    } else {
      return "...";
    }
  }
}
