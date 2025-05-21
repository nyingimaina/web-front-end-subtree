import Account from "@/Account/UI/Account";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import Invoice from "@/Invoices/UI/Invoice";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";
import { ReactNode } from "react";

export default function CustomerInvoice(): ReactNode {
  const contactId = useRouteParamReader({
    paramName: "contactId",
  });
  if (!contactId) {
    return <FrostedGlassOverlay show={true}>...</FrostedGlassOverlay>;
  }
  return (
    <Account>
      <Invoice contactId={contactId} invoiceTypeName="Customer" />
    </Account>
  );
}
