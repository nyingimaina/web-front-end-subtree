import { ReactNode } from "react";
import ConditionalRendererHelpers from "../Logic/ConditionalRendererHelpers";
import ConditionalRender from "./ConditionalRender";

export default function ForCustomersOnly(props: { children: ReactNode }) {
  return (
    <ConditionalRender
      condition={async () => await ConditionalRendererHelpers.isCustomerAsync()}
    >
      {props.children}
    </ConditionalRender>
  );
}
