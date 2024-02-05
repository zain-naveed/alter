import React from "react";
import styles from "./style.module.scss";
interface Props {
  titleStyle: any;
  title: string;
  role: string;
}

function Title({ title, titleStyle, role }: Partial<Props>) {
  return (
    <>
      <span className={titleStyle ? titleStyle : styles.title} role={role}>
        {title}
      </span>
    </>
  );
}

export default Title;
