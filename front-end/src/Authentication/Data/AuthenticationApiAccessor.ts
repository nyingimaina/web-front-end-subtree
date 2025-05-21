import ApiServiceBase from "@/ApiService/ApiServiceBase";
import IAuthenticationRequest from "./IAuthenticationRequest";
import IAuthenticationResponse from "./IAuthenticationResponse";
import IErrorResponse from "@/ApiService/IErrorResponse";

export default class AuthenticationApiService extends ApiServiceBase {
  protected route: string = "authentication";

  public async signInAsync(
    authenticationRequest: IAuthenticationRequest
  ): Promise<IAuthenticationResponse | undefined | IErrorResponse> {
    return await this.postAsync({
      endpoint: "sign-in",
      body: authenticationRequest,
    });
  }
}
