import Account from "@/Account/UI/Account";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import Invoice from "@/Invoices/UI/Invoice";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";
import { ReactNode } from "react";

export default function Manage(): ReactNode {
  const invoiceTypeName = useRouteParamReader({
    paramName: "invoiceTypeName",
  });
  if (!invoiceTypeName) {
    return <FrostedGlassOverlay show={true}>...</FrostedGlassOverlay>;
  }
  return (
    <Account>
      <Invoice invoiceTypeName={invoiceTypeName as InvoiceTypeNames} />
    </Account>
  );
}
