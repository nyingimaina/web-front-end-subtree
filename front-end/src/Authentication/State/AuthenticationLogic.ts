import ModuleStateManager from "module-state-manager";
import IAuthenticationRequest from "../Data/IAuthenticationRequest";
import AuthenticationRepository from "./AuthenticationRepository";
import AuthenticationApiService from "../Data/AuthenticationApiAccessor";
import ApiService from "@/ApiService/ApiService";
import IAuthenticationResponse from "../Data/IAuthenticationResponse";
import AuthenticatedUserTracker from "@/Account/AuthenticatedUserTracker";

export default class AuthenticationLogic extends ModuleStateManager<
  AuthenticationRepository,
  IAuthenticationRequest
> {
  repository = new AuthenticationRepository();
  model = {} as IAuthenticationRequest;

  public get canCallApi(): boolean {
    return this.model && this.model.email && this.model.password ? true : false;
  }

  public async signInAsync() {
    if (this.canCallApi !== true) {
      return;
    }
    const signInResponse = await new AuthenticationApiService().signInAsync(
      this.model
    );
    if (ApiService.isErrorResponse(signInResponse)) {
      throw new Error("Incorrect email or password. Please try again");
    } else {
      const authenticationResponse = signInResponse as IAuthenticationResponse;
      AuthenticatedUserTracker.setAuthenticatedUser(authenticationResponse);
    }
  }
}
