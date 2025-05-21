import RepositoryBase from "@/State/RepositoryBase";
import IDashboardCardData from "./IDashboardCardData";

export default class DashboardRepository extends RepositoryBase {
  thisMonthCards: IDashboardCardData[] = [];
  allTimeCards: IDashboardCardData[] = [];
}
