import classNames from "classnames";
import React from "react";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";
const FollowUserLoader = () => {
  return (
    <div
      className={classNames(
        "d-flex justify-content-between py-3 w-100",
        styles.search_list
      )}
    >
      <div className="d-flex align-items-center">
        <BoxLoader iconStyle={classNames(styles.image)} />
        <BoxLoader iconStyle={classNames(styles.avatar_name)} />
      </div>
      <BoxLoader iconStyle={classNames(styles.following)} />
    </div>
  );
};

export default FollowUserLoader;
