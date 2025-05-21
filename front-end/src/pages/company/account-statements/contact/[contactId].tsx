import Account from "@/Account/UI/Account";
import ContactStatement from "@/AccountStatements/UI/ContactStatement";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
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
      <ContactStatement contactId={contactId} />
    </Account>
  );
}
