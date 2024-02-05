import React from "react";
import classNames from "classnames";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";
interface Props {}

function NotificationLoader(props: Props) {
  const {} = props;

  return (
    <>
      <div className={classNames(styles.optionContainer, "py-2 px-3")}>
        <div
          className={classNames(
            "d-flex justify-content-start align-items-center"
          )}
        >
          <div className={classNames("position-relative")}>
            <BoxLoader iconStyle={styles.avatarStyle} />

            <div className={classNames(styles.iconContainer)}>
              <BoxLoader />
            </div>
          </div>

          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-center ms-2"
            )}
          >
            <div className={classNames(styles.notification_text_loader)}>
              <BoxLoader />
            </div>
            <label
              className={classNames("mt-1", styles.notification_half_loader)}
              style={{ color: "#808191" }}
            >
              <BoxLoader />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationLoader;
