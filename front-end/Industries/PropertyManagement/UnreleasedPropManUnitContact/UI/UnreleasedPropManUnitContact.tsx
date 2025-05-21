import React, { PureComponent } from "react";
import { IUnreleasedPropManUnitContact } from "../Data/IUnreleasedPropManUnitContact";

interface IProps {
  contact: IUnreleasedPropManUnitContact;
}

interface IState {
  // Define any state variables here
}

export default class UnreleasedPropManUnitContact extends PureComponent<
  IProps,
  IState
> {
  render() {
    const { contact } = this.props;
    return (
      <div>
        <h1>{contact.name}</h1>
        <p>{contact.contactDetails}</p>
        <p>{contact.isReleased ? "Released" : "Unreleased"}</p>
      </div>
    );
  }
}
