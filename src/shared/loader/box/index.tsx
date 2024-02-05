import classNames from "classnames";
import styles from "./style.module.scss";
interface Props {
  height?: number;
  width?: number;
  iconStyle?: any;
}

function BoxLoader(props: Props) {
  return (
    <>
      <div
        className={classNames(
          styles.skeletonLoader,
          props.iconStyle ? props.iconStyle : styles.short_clip
        )}
      ></div>
    </>
  );
}

export default BoxLoader;
