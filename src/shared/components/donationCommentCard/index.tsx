import { Star, defaultAvatar } from "assets";
import moment from "moment";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
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

function DonationCommentCard(props: Partial<Props>) {
  const navigate = useNavigate();
  const { isInLiveStream, item } = props;

  return (
    <>
      <div
        className={classNames(
          "d-flex justify-content-start ps-3 pe-0 pe-sm-1 w-100 py-4",
          styles.comment_container,
          styles.own_comment
        )}
      >
        <div className="row p-0 w-100 justify-content-between">
          <div className={classNames("col-12", "p-0 d-flex")}>
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
                  : "col-md-11 col-9 ms-lg-2 ms-sm-3 ms-0",
                "p-0 align-items-center d-flex "
              )}
            >
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
              </span>
              {item?.is_star ? <Star className="mb-2" /> : null}
              <span className={styles.avatar_time}>
                {moment.utc(item?.created_at).local().fromNow()}
              </span>

              <div
                className={classNames(
                  "ms-2 ",
                  styles.avatar_donation_container,
                  isInLiveStream ? styles?.displayCont1 : styles?.displayCont3
                )}
              >
                <span className={classNames(styles.avatar_donation)}>
                  {item?.content}
                </span>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              "mt-2 ms-1",
              styles.avatar_donation_container,
              isInLiveStream ? styles?.displayCont2 : styles?.displayCont4
            )}
          >
            <span className={classNames(styles.avatar_donation)}>
              {item?.content}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default DonationCommentCard;
