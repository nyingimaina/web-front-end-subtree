import ErrorResponseHandler from "@/ApiService/ErrorResponseHandler";
import IUser from "./IUser";
import CrudApiService from "@/ApiService/CrudApiService";

export default class UserApiService extends CrudApiService<IUser> {
  protected route: string = "users";

  public async getByCompanyIdAsync(args: {
    companyId: string;
  }): Promise<IUser[]> {
    return (await this.getAsync<IUser[]>({
      endpoint: "get-by-company-id",
      queryParams: {
        companyId: args.companyId,
      },
    })) as IUser[];
  }

  public async manageUserAsync(user: IUser): Promise<IUser | undefined> {
    const result = await this.postAsync<IUser>({
      endpoint: "manage",
      body: user,
    });
    return await ErrorResponseHandler.getResponseOrThrowError<IUser>(result);
  }

  public async toggleDeletionAsync(args: {
    userId: string;
    deleted: boolean;
  }): Promise<IUser | undefined> {
    const result = await this.getAsync<IUser>({
      endpoint: "toggle-deletion",
      queryParams: {
        userId: args.userId,
        deleted: args.deleted,
      },
    });
    return await ErrorResponseHandler.getResponseOrThrowError<IUser>(result);
  }
}
