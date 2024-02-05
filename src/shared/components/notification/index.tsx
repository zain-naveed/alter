import {
  defaultAvatar,
  LiveIcon,
  NotifyVideoIcon,
  UserAddIcon,
  NoNotification,
} from "assets";
import classNames from "classnames";
import moment from "moment";
import { useEffect } from "react";
import styles from "./style.module.scss";
import { useNavigate } from "react-router";
import { notificationType } from "shared/utils/constants";
import { routeConstant } from "shared/routes/routeConstant";
import NotContents from "shared/default/notContent";
import NotificationLoader from "./notificationLoader";

interface ProfileDropDownProps {
  openNotifications: boolean;
  list: any;
  setOpenNotifications: (val: boolean) => void;
  notificatonLoader: boolean;
}

const Notification = ({
  openNotifications,
  setOpenNotifications,
  list,
  notificatonLoader,
}: ProfileDropDownProps) => {
  function handleClick(e: any) {
    const elem: any = document.getElementById("profileDropDownContainer");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenNotifications(false);
      }
    }
  }
  useEffect(() => {
    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleClick(event);
      },
      true
    );
    // eslint-disable-next-lines
  }, []);

  return (
    <div
      className={classNames(styles.topLevelContainer, "px-2")}
      style={openNotifications ? { display: "flex" } : { display: "none" }}
      id="profileDropDownContainer"
    >
      <label className={classNames("pt-4 px-3", styles.title)}>
        Recent Notifications
      </label>
      <div className={classNames(styles.notificationsContainer, "py-3 w-100")}>
        {notificatonLoader ? (
          ["", "", "", ""].map((empty, inx) => {
            return <NotificationLoader key={`not-${inx}`} />;
          })
        ) : list?.length ? (
          list?.map((notify: any, ind: number) => {
            return (
              <NotifyCard
                setOpenNotifications={setOpenNotifications}
                handleClick={handleClick}
                {...notify}
                key={ind}
              />
            );
          })
        ) : (
          <NotContents msg="No notifications yet!" Icon={NoNotification} />
        )}
      </div>
    </div>
  );
};

interface NotifyCardProps {
  handleClick: (event: any) => void;
  setOpenNotifications: (val: boolean) => void;
  type: string;
  text: string;
  highlightedText: string;
  content: string;
  notificationable_type: string;
  user: {
    avatar: string;
    firstname: string;
    lastname: string;
  };
  sender: any;
  created_at: string;
  notificationable_id: number;
  notification_reference_type: any;
  notification_reference_type_id: any;
}

const NotifyCard = ({
  handleClick,
  setOpenNotifications,
  notificationable_type,
  sender,
  created_at,
  notificationable_id,
  notification_reference_type,
  notification_reference_type_id,
  content,
}: Partial<NotifyCardProps>) => {
  const navigate = useNavigate();
  const navigateToProfile = (userId: string) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  const navigation = (type: any, id: any) => {
    if (
      type === notificationType.commented_short ||
      notificationable_type === notificationType.new_short
    ) {
      navigate(routeConstant.shareShortDetail.path.replace(":id", "") + id);
    } else if (type === notificationType.new_stream) {
      navigate("/stream/" + id);
    } else if (type === notificationType.donation) {
      if (notification_reference_type === "0") {
        navigate("/profile/" + notification_reference_type_id);
      } else if (notification_reference_type === "1") {
        navigate("/share-short/" + notification_reference_type_id);
      } else if (notification_reference_type === "2") {
        navigate("/stream/" + notification_reference_type_id);
      }
    }
  };
  return (
    <div
      onClick={() => {
        document.body.removeEventListener(
          "click",
          (event: any) => {
            handleClick?.(event);
          },
          true
        );
        setOpenNotifications?.(false);
      }}
      className={classNames(styles.optionContainer, "py-2 px-3")}
    >
      <div
        className={classNames(
          "d-flex justify-content-start align-items-center"
        )}
      >
        <div className={classNames("position-relative")}>
          <img
            src={
              sender?.avatar
                ? sender?.social_login_id
                  ? sender?.avatar
                  : sender?.base_url + sender?.avatar
                : defaultAvatar
            }
            alt="user-pic"
            className={classNames("pointer", styles.avatarStyle)}
            onClick={() => navigateToProfile(sender?.id)}
          />
          {notificationable_type !== notificationType.donation ? (
            <div
              className={classNames(styles.iconContainer)}
              style={
                notificationable_type === notificationType.new_short ||
                notificationable_type === notificationType.commented_short
                  ? { backgroundColor: "#7fba7a" }
                  : notificationable_type === notificationType.new_stream
                  ? { backgroundColor: "#ff754c" }
                  : { backgroundColor: "#3f8cff" }
              }
            >
              {notificationable_type === notificationType.new_short ||
              notificationable_type === notificationType.commented_short ||
              notificationable_type === notificationType.liked ? (
                <NotifyVideoIcon className={classNames(styles.icon)} />
              ) : notificationable_type === notificationType.new_stream ? (
                <LiveIcon className={classNames(styles.icon)} />
              ) : notificationable_type != notificationType.donation ? (
                <UserAddIcon className={classNames(styles.icon)} />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>

        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-center ms-2"
          )}
        >
          <label
            className={classNames("pointer", styles.user)}
            onClick={() => navigateToProfile(sender?.id)}
          >
            {sender?.user_name}
          </label>
          <label
            className={classNames(styles.user)}
            style={{ color: "#808191" }}
          >
            {notificationable_type === notificationType.liked
              ? "Liked on your Stream"
              : notificationable_type === notificationType.commented_short
              ? "Commented on"
              : notificationable_type === notificationType.new_stream
              ? "Just started a"
              : notificationable_type === notificationType.new_short
              ? "Just Upload a new"
              : notificationable_type === notificationType.donation
              ? "Sent donation to"
              : "Just followed you"}
            <label
              className={classNames(styles.highlighted, "ms-2")}
              role={"button"}
              onClick={() =>
                navigation(notificationable_type, notificationable_id)
              }
            >
              {notificationable_type === notificationType.commented_short
                ? "Your Short"
                : notificationable_type === notificationType.new_stream
                ? "new Stream"
                : notificationable_type === notificationType.new_short
                ? "Short"
                : notificationable_type === notificationType.donation
                ? notification_reference_type === "0"
                  ? "You"
                  : notification_reference_type === "2"
                  ? "Your stream"
                  : notification_reference_type === "1"
                  ? "Your short"
                  : ""
                : ""}
            </label>
          </label>
        </div>
      </div>
      <label className={classNames(styles.time)}>
        {moment.utc(created_at).local().fromNow()}
      </label>
    </div>
  );
};

export default Notification;
