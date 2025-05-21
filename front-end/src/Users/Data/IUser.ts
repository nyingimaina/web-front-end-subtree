export default interface IUser {
  id: string;
  email: string;
  password: string;
  userRoleIds: string[];
  companyId: string;
  deleted: boolean;
}
