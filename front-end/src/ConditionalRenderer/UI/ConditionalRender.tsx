import { PureComponent, ReactNode } from "react";

interface IProps {
  condition: () => Promise<boolean>;
  children: ReactNode;
}

interface IState {
  conditionIsTrue: boolean;
}
export default class ConditionalRender extends PureComponent<IProps, IState> {
  state = {
    conditionIsTrue: false,
  } as IState;

  async componentDidMount() {
    this.setState({
      conditionIsTrue: await this.props.condition(),
    });
  }
  render() {
    return this.state.conditionIsTrue ? this.props.children : null;
  }
}
