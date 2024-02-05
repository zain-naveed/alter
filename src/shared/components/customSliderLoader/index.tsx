import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import "./style.scss";

function CustomSliderLoader() {
  return (
    <div className="position-relative">
      <div className={classNames("position-relative cover-preview")}>
        <BoxLoader iconStyle={"slider_header"} />
      </div>
    </div>
  );
}

export default CustomSliderLoader;
