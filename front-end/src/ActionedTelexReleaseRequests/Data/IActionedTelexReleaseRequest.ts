import ActionedTelexReleaseRequestStatusNames from "./ActionedTelexReleaseRequestStatusNames";

export default interface IActionedTelexReleaseRequest {
  telexReleaseRequestBatchHouseBillOfLadingNumberId: string;
  status: ActionedTelexReleaseRequestStatusNames;
  actionedBy: string;
  actionedAt: Date;
}
