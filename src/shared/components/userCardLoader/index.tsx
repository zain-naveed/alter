import classNames from "classnames";
import BoxLoader from "shared/loader/box";

import styles from "./style.module.scss";

function UserCardLoader() {
  return (
    <>
      <div
        className={`d-flex flex-column align-items-center ${styles.userContainer}`}
      >
        <div className={classNames(styles.userIconContainer, "my-2")}>
          <BoxLoader iconStyle={classNames(styles.userIcon)} />
        </div>
        <BoxLoader iconStyle={classNames(styles.title)} />
        <BoxLoader iconStyle={classNames(styles.subtitle, "mt-2")} />
      </div>
    </>
  );
}

export default UserCardLoader;
