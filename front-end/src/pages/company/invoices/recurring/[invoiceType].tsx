import Account from "@/Account/UI/Account";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";
import RecurringInvoices from "@/ViewInvoiceRepetitionTrackers/UI/RecurringInvoices";
import { ReactNode } from "react";

export default function RecurringInvoicesPage(): ReactNode {
  const invoiceType = useRouteParamReader({
    paramName: "invoiceType",
  });
  if (!invoiceType) {
    return <FrostedGlassOverlay show={true}>...</FrostedGlassOverlay>;
  }
  return (
    <Account>
      <RecurringInvoices invoiceType={invoiceType as InvoiceTypeNames} />
    </Account>
  );
}
