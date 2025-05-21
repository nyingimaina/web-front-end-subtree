import { ReactNode } from "react";

export default interface IDashboardCardData {
  title: string;
  formattedValue: string;
  rawValue: number;
  icon: ReactNode;
  color: string;
  rank: number;
  onClick?: () => void;
}
