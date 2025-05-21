import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "../Styles/InvoiceDocument.module.css";
import { InvoiceDocumentWithRef } from "./InvoiceDocumentWithRef";
import FastLayout from "@/layouts/ui/FastLayout";

interface InvoiceWrapperProps {
  invoiceId: string;
}

const InvoiceDocumentWrapper: React.FC<InvoiceWrapperProps> = ({
  invoiceId,
}) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Invoice",
  });

  return (
    <FastLayout title="Invoice">
      <div className={styles.centerer}>
        <div className={styles.wrapper}>
          <button
            onClick={() => {
              handlePrint();
            }}
            className={styles.downloadButton}
          >
            Download Invoice
          </button>
          {/* Invoice content */}
          <InvoiceDocumentWithRef ref={componentRef} invoiceId={invoiceId} />
        </div>
      </div>
    </FastLayout>
  );
};

export default InvoiceDocumentWrapper;
