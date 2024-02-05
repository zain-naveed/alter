import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

const UserLoader = () => {
  return (
    <div className={classNames("d-flex mt-4")}>
      <BoxLoader iconStyle={classNames(styles.photoStyle)} />
      <div className="d-flex flex-column ms-3">
        <BoxLoader iconStyle={classNames(styles.userTitle, "mt-1")} />
        <BoxLoader iconStyle={classNames(styles.viewerLabel, "mt-1")} />
        <div className="d-flex align-items-center mt-1">
          <BoxLoader iconStyle={classNames(styles.liveDot)} />
          <BoxLoader iconStyle={classNames(styles.viewerLabel, "ms-1")} />
        </div>
      </div>
    </div>
  );
};

export default UserLoader;
