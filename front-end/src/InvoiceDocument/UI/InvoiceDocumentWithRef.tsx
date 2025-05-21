import React, { forwardRef } from "react";
import { InvoiceDocument, InvoiceDocumentProps } from "./InvoiceDocument";

// Wrapping component to allow use of `useRef`

export const InvoiceDocumentWithRef = forwardRef<
  HTMLDivElement,
  InvoiceDocumentProps
>((props, ref) => (
  <div ref={ref}>
    <InvoiceDocument {...props} />
  </div>
));

InvoiceDocumentWithRef.displayName = "InvoiceDocumentWithRef";
