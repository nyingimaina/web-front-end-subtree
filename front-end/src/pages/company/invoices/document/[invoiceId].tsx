import Account from "@/Account/UI/Account";
import InvoiceDocumentWrapper from "@/InvoiceDocument/UI/InvoiceDocumentWrapper";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";

export default function InvoiceDocumentPage() {
  const invoiceId = useRouteParamReader({
    paramName: "invoiceId",
  });

  if (!invoiceId) {
    return <div>...</div>;
  } else {
    return (
      <Account allowAnonymous={true}>
        <InvoiceDocumentWrapper invoiceId={invoiceId} />
      </Account>
    );
  }
}
