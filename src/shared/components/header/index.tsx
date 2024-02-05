import {
  ArrowLeftIcon,
  BoradCastIcon,
  defaultAvatar,
  HamburgerIcon,
  NotificationIcon,
  SearchIcon,
  UploadNavIcon,
} from "assets";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetSearch, setSearch } from "shared/redux/reducers/searchSlice";
import { routeConstant } from "shared/routes/routeConstant";
import {
  notificationCount,
  notificationList,
} from "shared/services/notfyService";
import { classNames } from "shared/utils/helper";
import useDebounce from "shared/hooks/useDebounce";
import Notification from "../notification";
import ProfileDropDown from "../profileDropDown";
import styles from "./style.module.scss";
import { setNotification } from "shared/redux/reducers/notificationSlice";
import CustomButton from "../customButton";
import { resetUser } from "shared/redux/reducers/userSlice";
import { resetRouteReducer } from "shared/redux/reducers/routeSlice";
import { resetFollowings } from "shared/redux/reducers/followingSlice";
import { resetLiveUsers } from "shared/redux/reducers/liveUsersSlice";
import { Logout } from "shared/services/authService";
import { resetShortOptions } from "shared/redux/reducers/shortSlice";
import { toastMessage } from "../toast";

interface headerProps {
  isSideCanvas: boolean;
  setIsSideCanvas: (val: boolean) => void;
}

const Header = ({ setIsSideCanvas }: headerProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, search, notification } = useSelector(
    (state: any) => state?.root
  );
  const [searchVal, setSearchValue] = useState<string>(search?.text);
  const [isMobileSearch, setIsMobileSearch] = useState<boolean>(false);
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);
  const [totalNotificationCount, setTotalNotificationCount] = useState<number>(
    notification?.count
  );
  const [notificatnList, setnotificationList] = useState<any>([]);
  const [notificatonLoader, setNotificationLoader] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const notifcationCountRef = useRef<any>(0);
  const navigateShort = () => {
    navigate(routeConstant.uploadShort.path);
  };
  const navigateStream = () => {
    navigate(routeConstant.startSream.path);
  };
  const handleLogout = () => {
    let formData = new FormData();
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
          navigate(routeConstant.signup.path);
        } else {
          toastMessage("error", message);
        }
      })
      .finally(() => {
        setLoading(false);
        setOpenSelection(false);
      });
  };

  useDebounce(
    () => {
      if (searchVal !== "" || searchVal == "") {
        dispatch(setSearch({ text: searchVal, updated: "1" }));
        if (searchVal) {
          navigate(routeConstant?.search.path);
        }
      } else {
        dispatch(setSearch({ text: search?.text, updated: "2" }));
      }
    },
    [searchVal],
    800
  );

  useEffect(() => {
    if (search?.updated === "2") {
      setSearchValue("");
    }
    // eslint-disable-next-line
  }, [search?.updated]);
  const getAllNotificationCount = () => {
    notificationCount()
      .then(
        ({
          data: {
            data: { notificationsCount },
          },
        }) => {
          if (notification?.count === 0) {
            let counter = notification?.count + notificationsCount;
            setTotalNotificationCount(counter);
          } else {
            setTotalNotificationCount(notificationsCount);
          }
          notifcationCountRef.current = notificationsCount;
        }
      )
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (!user?.guest && user?.user?.token) {
      getAllNotificationCount();
    }
  }, []);
  const handleClickNotification = () => {
    let notBool = !openNotifications;
    setOpenNotifications(notBool);
    setTotalNotificationCount(0);
    notifcationCountRef.current = 0;
    dispatch(
      setNotification({
        count: 0,
      })
    );
    noitfitionList();
  };
  const noitfitionList = () => {
    setNotificationLoader(true);
    notificationList()
      .then(
        ({
          data: {
            data: { notifications },
          },
        }) => {
          setnotificationList(notifications);
          // setNotificationCount(notificationsCount);
        }
      )
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setNotificationLoader(false);
      });
  };

  useEffect(() => {
    if (notification?.count === 0) {
      let counter = notification?.count + notifcationCountRef.current;
      setTotalNotificationCount(counter);
    } else {
      setTotalNotificationCount(notification?.count);
    }
  }, [notification?.count]);

  const handleVisibilityEvent = () => {
    if (!document.hidden && !user?.guest && user?.user?.token) {
      getAllNotificationCount();
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityEvent);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityEvent);
    };
  }, []);

  return (
    <nav className={`${styles.headerContainer} row p-sm-3 m-0`}>
      {isMobileSearch && (
        <div className="d-flex justify-content-center align-items-center">
          <ArrowLeftIcon
            role={"button"}
            className={classNames(styles.arrowIcon)}
            onClick={() => setIsMobileSearch(false)}
          />
          <div
            className={classNames(
              "d-flex justify-content-center align-items-center w-100 ms-2",
              styles.searchInputContainer,
              styles.searchInputContainerActive
            )}
          >
            <SearchIcon className={styles.icon} />
            <input
              placeholder="Search Everything"
              value={searchVal}
              autoComplete="none"
              type="text"
              className={classNames(styles.searchInputStyle)}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onFocus={() => {
                setIsInputActive(true);
              }}
              onBlur={() => {
                setIsInputActive(false);
              }}
            />
          </div>
        </div>
      )}
      <div
        className={classNames(
          isMobileSearch && "d-none",
          "col-lg-9 col-md-8 col-6 d-flex justify-content-start align-items-center"
        )}
      >
        {!isMobileSearch && (
          <>
            <HamburgerIcon
              role={"button"}
              className={classNames("me-3 d-sm-none")}
              onClick={() => setIsSideCanvas(true)}
            />
            <SearchIcon
              className={classNames(styles.icon, "d-sm-none")}
              role={"button"}
              onClick={() => setIsMobileSearch(true)}
            />
          </>
        )}
        <div
          className={classNames(
            "d-sm-flex justify-content-center align-items-center d-none",
            styles.searchInputContainer,
            isInputActive && styles.searchInputContainerActive
          )}
        >
          <label className={styles.icon}>
            <SearchIcon className={styles.icon} />
          </label>

          <input
            autoComplete="none"
            placeholder="Search Everything"
            value={searchVal}
            type="text"
            className={classNames(styles.searchInputStyle)}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onFocus={() => {
              setIsInputActive(true);
            }}
            onBlur={() => {
              setIsInputActive(false);
            }}
          />
        </div>
      </div>
      {user?.guest || !user?.user?.token ? (
        <div
          className={classNames(
            isMobileSearch && "d-none",
            "col-lg-3 col-md-4 col-6 d-flex align-items-center justify-content-end gap-2"
          )}
        >
          <CustomButton
            title="Register Now"
            containerStyle={classNames(styles.RegBtn)}
            submitHandle={handleLogout}
            loading={loading}
            isDisable={loading}
          />
        </div>
      ) : (
        <div
          className={classNames(
            isMobileSearch && "d-none",
            "col-lg-3 col-md-4 col-6 d-flex justify-content-between align-items-center "
          )}
        >
          <div
            onClick={navigateStream}
            className={classNames(
              "d-flex flex-column align-items-center",
              styles.notificationContainer
            )}
            role={"button"}
          >
            <BoradCastIcon className={styles.icon} />
          </div>
          <div
            onClick={navigateShort}
            className={classNames(
              "d-flex flex-column align-items-center",
              styles.notificationContainer
            )}
            role={"button"}
          >
            <UploadNavIcon className={styles.icon} />
          </div>

          <div
            role={"button"}
            className={`position-relative ${styles.notificationContainer}`}
            onClick={() => handleClickNotification()}
          >
            <NotificationIcon className={styles.icon} />

            {totalNotificationCount ? (
              <div className={styles.notificationTextContainer} role={"button"}>
                <label className={styles.notificationText} role={"button"}>
                  {totalNotificationCount > 9 ? "9+" : totalNotificationCount}
                </label>
              </div>
            ) : (
              ""
            )}
          </div>

          <div
            role={"button"}
            className={"ms-2"}
            onClick={() => setOpenSelection(!openSelection)}
          >
            <img
              className={styles.headerAvatarIcon}
              src={
                user?.user?.social_login_id
                  ? user?.user?.avatar
                  : user?.user?.avatar
                  ? user?.user?.base_url + user?.user?.avatar
                  : defaultAvatar
              }
              alt="user-pic"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {openSelection && (
        <ProfileDropDown
          openSelection={openSelection}
          setOpenSelection={setOpenSelection}
        />
      )}
      {openNotifications && (
        <Notification
          list={notificatnList}
          notificatonLoader={notificatonLoader}
          openNotifications={openNotifications}
          setOpenNotifications={setOpenNotifications}
        />
      )}
    </nav>
  );
};

export default Header;
