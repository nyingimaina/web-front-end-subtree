import IAuthenticationResponse from "@/Authentication/Data/IAuthenticationResponse";
import StorageUtil from "@/OnBrowserStorage/StorageUtil";

const AuthenticatedUserKey = "AuthenticatedUser";

export default class AuthenticatedUserTracker {
  public static setAuthenticatedUser(
    authenticationResponse: IAuthenticationResponse
  ) {
    if (!authenticationResponse) {
      return;
    }
    StorageUtil.set(AuthenticatedUserKey, authenticationResponse);
  }

  public static removeAuthenticatedUser() {
    StorageUtil.remove(AuthenticatedUserKey);
  }

  public static get authenticatedUser(): IAuthenticationResponse | undefined {
    const parsedValue =
      StorageUtil.get<IAuthenticationResponse>(AuthenticatedUserKey);

    if (!parsedValue) {
      return undefined;
    }
    if (!parsedValue || !parsedValue.id || !parsedValue.email) {
      return undefined;
    }
    return parsedValue;
  }

  public static get hasUser(): boolean {
    return this.authenticatedUser &&
      this.authenticatedUser.userId &&
      this.authenticatedUser.email
      ? true
      : false;
  }
}
