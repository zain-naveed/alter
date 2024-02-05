import { defaultAvatar, MoreIcon, Star } from "assets";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import moment from "moment";
import CommentDropDown from "../commentDropdown";
import { useNavigate } from "react-router";
import React, { useState } from "react";
import { routeConstant } from "shared/routes/routeConstant";
interface Props {
  comment: string;
  isOwn: boolean;
  isInLiveStream: boolean;
  item: any;
  index: number;
  commentAction: any;
  setSelectComment: any;
  streamUserId: any;
  isStream: boolean;
}

function CommentCard(props: Partial<Props>) {
  const navigate = useNavigate();
  const {
    isInLiveStream,
    item,
    index,
    commentAction,
    setSelectComment,
    isOwn,
    streamUserId,
    isStream,
  } = props;
  const [openSelection, setOpenSelection] = useState<boolean>(true);
  const [selectIndx, setSelectIndx] = useState<number>(-1);
  const {
    user: { user },
  } = useSelector((state: any) => state.root);

  return (
    <>
      <div
        className={classNames(
          "d-flex justify-content-start ps-3 pe-0 pe-sm-1 w-100 py-4",
          styles.comment_container,
          isOwn && styles.own_comment
        )}
      >
        <div className="row p-0 w-100 justify-content-between">
          <div
            className={classNames(
              isInLiveStream || isStream ? "col-12" : "col-10",
              "p-0 d-flex"
            )}
          >
            <div
              className={classNames(
                isInLiveStream ? "col-2" : "col-md-1 col-2",
                "p-0"
              )}
            >
              <img
                src={
                  item?.user?.avatar
                    ? item?.user?.social_login_id
                      ? item?.user?.avatar
                      : item?.user?.base_url + item?.user?.avatar
                    : defaultAvatar
                }
                className={classNames(styles.avatar, "pointer")}
                onClick={() =>
                  navigate(
                    routeConstant.profile.path.replace(":id", "") +
                      item?.user?.id
                  )
                }
                alt="user-pic"
              />
            </div>
            <div
              className={classNames(
                isInLiveStream
                  ? "col-9 ms-md-2 ms-0"
                  : isStream
                  ? "col-md-11 col-9 ms-lg-2 ms-sm-3 ms-0"
                  : "col-md-9 col-9 ms-lg-2 ms-sm-3 ms-0",
                "p-0"
              )}
            >
              <div className={classNames("d-flex align-items-center ")}>
                <span
                  className={classNames(styles.avatar_name, "pointer")}
                  onClick={() =>
                    navigate(
                      routeConstant.profile.path.replace(":id", "") +
                        item?.user?.id
                    )
                  }
                >
                  {item?.user?.first_name} {item?.user?.last_name}
                </span>{" "}
                {item?.is_star ? <Star className="mb-2" /> : null}
                <span className={styles.avatar_time}>
                  {moment.utc(item?.created_at).local().fromNow()}
                </span>
              </div>
              <div className={classNames("mt-1 mt-sm-2")}>
                <p className={classNames(styles.comment_para, "mb-0")}>
                  {item?.content}
                </p>
              </div>
            </div>
          </div>
          {commentAction ? (
            !isStream ? (
              item?.user?.id === user?.id || streamUserId === user?.id ? (
                <div
                  className={classNames(
                    "col-1 p-0 d-flex justify-content-end mt-2"
                  )}
                  onClick={() => {
                    if (index === 0 || index) {
                      setSelectIndx(index);
                    }
                    setSelectComment(item);
                    setOpenSelection(true);
                  }}
                  role={"button"}
                >
                  <MoreIcon className={classNames(styles.icon)} />
                </div>
              ) : null
            ) : null
          ) : null}
        </div>
        {selectIndx === index && openSelection ? (
          <CommentDropDown
            setSelectComment={setSelectComment}
            cmntDropAction={commentAction}
            openSelection={openSelection}
            streamerId={streamUserId}
            isOwn={isOwn}
            setOpenSelection={setOpenSelection}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default CommentCard;
