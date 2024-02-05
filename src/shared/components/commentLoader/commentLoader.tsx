import React from "react";
import BoxLoader from "shared/loader/box";
import { classNames } from "shared/utils/helper";
import styles from "./cstyle.module.scss";
interface Props {
  comment: string;
  isOwn: boolean;
  isInLiveStream: boolean;
  item: any;
  index: number;
  commentAction: any;
  setSelectComment: any;
}

function CommentLoader(props: Partial<Props>) {
  const { isInLiveStream } = props;

  return (
    <>
      <div
        className={classNames(
          "d-flex justify-content-start ps-3 pe-0 pe-sm-1 w-100 py-4",
          styles.comment_container
        )}
      >
        <div className="row p-0 w-100">
          <div
            className={classNames(
              isInLiveStream
                ? "col-2"
                : "col-md-1 col-2 d-flex  justify-content-center",
              "p-0"
            )}
          >
            <BoxLoader iconStyle={classNames(styles.avatar)} />
          </div>
          <div
            className={classNames(
              isInLiveStream ? "col-9" : "col-md-10 col-9",
              "p-0"
            )}
          >
            <div className={classNames("d-flex mt-2")}>
              <BoxLoader iconStyle={classNames(styles.avatar_name_loader)} />
              <span className={styles.avatar_time}></span>
            </div>
            <div className={classNames("mt-1 mt-sm-4")}>
              <div className={classNames(styles.comment_para, "mb-0")}>
                <BoxLoader iconStyle={classNames(styles.comment_para_loader)} />
              </div>
              <div className={classNames(styles.comment_para, "mt-2")}>
                <BoxLoader
                  iconStyle={classNames(styles.comment_second_para_loader)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommentLoader;
