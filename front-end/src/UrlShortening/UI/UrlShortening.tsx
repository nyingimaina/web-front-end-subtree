import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import { PureComponent } from "react";
import ShortUrlCodeLogic from "../State/ShortUrlCodeLogic";

interface IProps {
  shortUrlCode: string;
}
const logic = new ShortUrlCodeLogic();
export default class UrlShortening extends PureComponent<IProps> {
  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync({ shortUrlCode: this.props.shortUrlCode });
    if (logic.repository.shortUrlCode) {
      window.location.href = logic.repository.shortUrlCode.url;
    } else {
      window.location.href = "/nowhere";
    }
  }
  render() {
    return (
      <FrostedGlassOverlay show={logic.repository.busy}>
        <></>
      </FrostedGlassOverlay>
    );
  }
}
