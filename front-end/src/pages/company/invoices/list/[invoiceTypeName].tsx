import { ReactNode } from "react";
import InvoicesList from "@/InvoicesList/UI/InvoicesList";
import Account from "@/Account/UI/Account";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";

export default function InvoicesListPage(): ReactNode {
  const invoiceTypeName = useRouteParamReader({
    paramName: "invoiceTypeName",
  });
  if (!invoiceTypeName) {
    return <FrostedGlassOverlay show={true}>...</FrostedGlassOverlay>;
  }
  return (
    <Account>
      <InvoicesList invoiceTypeName={invoiceTypeName as InvoiceTypeNames} />
    </Account>
  );
}
