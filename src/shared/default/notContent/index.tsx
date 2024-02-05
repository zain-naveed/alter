import React from "react";
import { NoContent } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";
interface Props {
    msg:string,
    Icon?:any

}

function NotContents(props: Props) {
  const {msg,Icon} = props;

  return (
    <div className={classNames("d-flex flex-column justify-content-center  align-items-center w-100",styles.minHeight)}>
        { 
        Icon ? <Icon /> :<NoContent />
        }
      
      <label className={classNames(styles.noContentText, "mt-3")}>
        {msg}
      </label>
    </div>
  );
}

export default NotContents;
