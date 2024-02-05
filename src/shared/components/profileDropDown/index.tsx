import { DropDownUserIcon, LogoutIcon, SettingIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { resetRouteReducer } from "shared/redux/reducers/routeSlice";
import { resetUser } from "shared/redux/reducers/userSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { Logout } from "shared/services/authService";
import styles from "./style.module.scss";
import {
  resetNotification,
  setNotification,
} from "shared/redux/reducers/notificationSlice";
import { Spinner } from "react-bootstrap";
import { resetSearch } from "shared/redux/reducers/searchSlice";
import { resetFollowings } from "shared/redux/reducers/followingSlice";
import { resetLiveUsers } from "shared/redux/reducers/liveUsersSlice";
import { resetShortOptions } from "shared/redux/reducers/shortSlice";
import { toastMessage } from "../toast";

interface ProfileDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
}

const ProfileDropDown = ({
  openSelection,
  setOpenSelection,
}: ProfileDropDownProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notification } = useSelector((state: any) => state.root);
  const [loading, setLoading] = useState<boolean>(false);
  const profileDropDownOptions: {
    title: string;
    Icon: any;
    route: string;
  }[] = [
    {
      title: "My Profile",
      Icon: DropDownUserIcon,
      route: `/profile/${user?.user?.id}`,
    },
    {
      title: "Account Settings",
      Icon: SettingIcon,
      route: routeConstant.setting.path,
    },
    {
      title: "Logout",
      Icon: LogoutIcon,
      route: routeConstant.default.path,
    },
  ];

  function handleClick(e: any) {
    const elem: any = document.getElementById("profileDropDownContainer");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection(false);
      }
    }
  }

  const handleLogout = () => {
    let formData = new FormData();
    let devId = notification?.device_id;
    let fcmTok = notification?.fcm_token;
    if (devId) {
      formData.append("device_id", devId);
      formData.append("fcm_token", fcmTok);
    }
    setLoading(true);
    Logout(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          dispatch(resetUser());
          dispatch(resetRouteReducer());
          dispatch(
            setNotification({
              count: 0,
              device_id: "",
              fcm_token: "",
              permission: notification?.permission,
            })
          );
          dispatch(resetSearch());
          dispatch(resetFollowings());
          dispatch(resetLiveUsers());
          dispatch(resetShortOptions());
        } else {
          toastMessage("error", message);
        }
      })
      .finally(() => {
        setLoading(false);
        setOpenSelection(false);
      });
  };
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
      className={`${styles.optionsContainer} p-0`}
      style={openSelection ? { display: "flex" } : { display: "none" }}
      id="profileDropDownContainer"
      role={"button"}
    >
      {profileDropDownOptions?.map((opt, ind) => {
        let Icon = opt?.Icon;
        return (
          <div
            onClick={() => {
              document.body.removeEventListener(
                "click",
                (event: any) => {
                  handleClick(event);
                },
                true
              );

              if (opt?.title !== "Logout") {
                navigate(opt?.route);
                setOpenSelection(false);
              } else {
                handleLogout();
              }
            }}
            key={ind}
            className={`${styles.optionContainer} p-3`}
            style={
              ind === profileDropDownOptions?.length - 1
                ? {
                    borderBottomColor: "transparent",
                    borderBottomRightRadius: "14px",
                    borderBottomLeftRadius: "14px",
                  }
                : ind === 0
                ? {
                    borderBottomColor: "#E4E4E4",
                    borderTopRightRadius: "14px",
                    borderTopLeftRadius: "14px",
                  }
                : { borderBottomColor: "#E4E4E4" }
            }
          >
            <Icon
              className={classNames(
                opt?.title !== "Logout" && styles.icon,
                styles.iconSize
              )}
            />
            <label
              className={classNames(styles.optionLabel, "ms-3")}
              style={opt?.title === "Logout" ? { color: "#ff754c" } : {}}
              role={"button"}
            >
              {loading && opt?.title === "Logout" ? (
                <Spinner color="#6c5dd3" size="sm" animation="border" />
              ) : (
                opt?.title
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileDropDown;
