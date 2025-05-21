import ModuleStateManager from "module-state-manager";
import UserListRepository from "./UserListRepository";
import CompanyApiService from "@/Companies/Data/CompanyApiService";
import ICompany from "@/Companies/Data/ICompany";
import UserApiService from "@/Users/Data/UserApiService";
import IUser from "@/Users/Data/IUser";
import ErrorResponseHandler from "@/ApiService/ErrorResponseHandler";
import RoleApiService from "@/Roles/Data/RoleApiService";
import IRole from "@/Roles/Data/IRole";

export default class UserListLogic extends ModuleStateManager<
  UserListRepository,
  IUser
> {
  repository: UserListRepository = new UserListRepository();
  model = {} as IUser;

  public async initializeAsync() {
    await Promise.all([
      this.getCompanyAsync(),
      this.getUserAsync(),
      this.getRolesAsync(),
    ]);
    this.rerender();
  }

  public toggleRole(roleId: string) {
    if (this.model.userRoleIds.includes(roleId)) {
      this.removeRole(roleId);
    } else {
      this.addRole(roleId);
    }
  }

  public get activeUsers(): IUser[] {
    return this.repository.users.filter((candidate) => {
      return candidate.deleted !== true;
    });
  }

  public get deletedUsers(): IUser[] {
    return this.repository.users.filter((candidate) => {
      return candidate.deleted === true;
    });
  }

  public async toggleUserAsync(args: { userId: string; deleted: boolean }) {
    const actionResponse = await new UserApiService().toggleDeletionAsync(args);
    const user =
      ErrorResponseHandler.getResponseOrThrowError<IUser>(actionResponse);
    if (user) {
      const targetUser = this.repository.users.find(
        (a) => a.id === (user as IUser).id
      );
      if (targetUser) {
        targetUser.deleted = args.deleted;
        this.updateRepository({});
      }
    }
  }

  public async upsertAsync(): Promise<void> {
    this.model.companyId = this.repository.company.id;
    const saved = await new UserApiService().manageUserAsync(this.model);
    if (!saved) {
      return;
    } else {
      const savedUser = saved as IUser;
      this.repository.users = this.repository.users.filter(
        (a) => a.id !== savedUser.id
      );
      this.repository.users.push(savedUser);
      this.updateRepository({});
    }
  }

  private addRole(roleId: string) {
    this.model.userRoleIds.push(roleId);
    this.updateModel({});
  }

  private removeRole(roleId: string) {
    this.model.userRoleIds = this.model.userRoleIds.filter((a) => a != roleId);
    this.updateModel({});
  }

  private async getUserAsync() {
    this.repository.users = await new UserApiService().getByCompanyIdAsync({
      companyId: this.repository.company.id,
    });
  }

  private async getCompanyAsync() {
    this.repository.company = (await new CompanyApiService().getByIdAsync({
      id: this.repository.company.id,
    })) as ICompany;
  }

  private async getRolesAsync() {
    const results = await new RoleApiService().getPage();
    if (results == typeof "string") {
      throw new Error(results);
    } else {
      this.repository.roles = (results as IRole[]).filter(
        (a) => a.roleName.toLocaleLowerCase() !== "root"
      );
    }
  }
}
