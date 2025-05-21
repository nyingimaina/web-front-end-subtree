import RepositoryBase from "@/State/RepositoryBase";
import ITransaction from "../../../Transactions/Data/ITransaction";

export default class AccountStatementRepository extends RepositoryBase {
  transactions: ITransaction[] = [];
}
