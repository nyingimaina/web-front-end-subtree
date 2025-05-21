import { ReactNode } from "react";

// types.ts
export default interface IMenuItem {
  label: ReactNode;
  onClick?: () => void;
  submenu?: IMenuItem[];
}
