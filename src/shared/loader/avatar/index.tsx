import React from "react";
import styles from "./style.module.scss";
interface Props {
  height: number;
  width: number;
  avatarStyle: any;
}

function AvatarLoader(props: Partial<Props>) {
  return (
    <>
      <div
        className={`${styles.avatar} ${styles.skeletonLoader} ${
          props.avatarStyle ? props.avatarStyle : ""
        }`}
        style={props}
      ></div>
    </>
  );
}

export default AvatarLoader;
