import { IStackFrame } from "./IStackFrame";

export interface IEvent {
  description: string;
  exceptionDateUtc: string;
  exceptionType: string;
  extraInformation: string;
  frames: IStackFrame[];
  message: string;
  user: string;
}
