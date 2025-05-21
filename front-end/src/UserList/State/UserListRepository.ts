import ICompany from "@/Companies/Data/ICompany";
import IRole from "@/Roles/Data/IRole";
import IUser from "@/Users/Data/IUser";

export default class UserListRepository {
  users: IUser[] = [];
  company: ICompany = {
    id: "",
    name: "",
  } as ICompany;
  roles: IRole[] = [];
}
