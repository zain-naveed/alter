import {
  defaultAvatar,
  FeedIcon,
  HamburgerIcon,
  LoadMoreIcon,
  Logo,
  PlaylistIcon,
  SettingIcon,
  UserIcon,
  VideoIcon,
} from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import BoxLoader from "shared/loader/box";
import { routeConstant } from "shared/routes/routeConstant";
import SideCanvasItem from "./sideCanvasItem";
import styles from "./style.module.scss";

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  sideNavUsers: any;
  loading: boolean;
  moreLoader: boolean;
  moreLoad: boolean;
  loadMore: () => void;
}

const SideCanvas = ({
  isOpen,
  setIsOpen,
  sideNavUsers,
  loading,
  moreLoader,
  moreLoad,
  loadMore,
}: SideCanvasProps) => {
  const { user, followings } = useSelector((state: any) => state.root);
  const publicNavigationItems: { label: string; Icon: any; route: string }[] = [
    { label: "Global Feed", Icon: FeedIcon, route: "/feed" },
    { label: "Shorts", Icon: VideoIcon, route: "/shorts" },
    { label: "Following", Icon: UserIcon, route: "/following" },
    {
      label: "Your Streams",
      Icon: PlaylistIcon,
      route: `/profile/${user?.user?.id}`,
    },
  ];
  const guestNavigationItems: { label: string; Icon: any; route: string }[] = [
    { label: "Global Feed", Icon: FeedIcon, route: "/feed" },
    { label: "Shorts", Icon: VideoIcon, route: "/shorts" },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(location?.pathname);
  const [isProfile, setIsProfile] = useState<boolean>(false);
  const [defaultUserCount, setDefaultUserCount] = useState<number>(0);
  const [navigationItems] = useState<
    { label: string; Icon: any; route: string }[]
  >(user?.guest ? guestNavigationItems : publicNavigationItems);

  const handleRoute = () => {
    if (location?.pathname === navigationItems[3]?.route) {
      setIsProfile(false);
    } else if (location?.pathname.includes("profile")) {
      setIsProfile(true);
    } else {
      setIsProfile(false);
    }
  };

  function handleClick(e: any) {
    const elem: any = document.getElementById("sideCanvas");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    let elem: any = document.getElementById("backDropContainer");
    elem.addEventListener("click", (event: any) => {
      handleClick(event);
    });
    setActiveTab(location?.pathname);
    handleRoute();
    // eslint-disable-next-line
  }, [location?.pathname]);

  useEffect(() => {
    if (moreLoader === false) {
      setDefaultUserCount(defaultUserCount + 6);
    }
  }, [moreLoader]);

  return (
    <div
      className={classNames(styles.backDropContainer, "d-sm-none")}
      style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      id="backDropContainer"
    >
      <div
        className={classNames(
          styles.mainContainer,
          isOpen ? styles.shown : styles.hidden
        )}
        id="sideCanvas"
      >
        <nav
          className={`${"justify-content-between p-4"}  ${
            styles.logoContainer
          } d-flex align-items-center w-100 p-0`}
        >
          <Logo
            role="button"
            onClick={() => {
              setIsOpen(false);
              navigate(navigationItems[0].route);
              setIsProfile(false);
              setActiveTab(navigationItems[0]?.route);
            }}
          />
          <HamburgerIcon
            role={"button"}
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </nav>
        <div
          className={`container d-flex  flex-column px-3 ${styles.contentContainer}`}
        >
          <label
            className={`${"px-3 mb-2 d-flex w-100 justify-content-start mt-1"}  ${
              styles.sideNavSubcontainerTitle
            }  `}
          >
            <label className={`${"me-1"} `}>Global</label>
            Feeds
          </label>
          {navigationItems.map((navItem, index) => {
            return (
              <SideCanvasItem
                key={index}
                label={navItem.label}
                Icon={navItem.Icon}
                active={!isProfile && location?.pathname === navItem?.route}
                onClick={() => {
                  setIsOpen(false);
                  navigate(navItem.route);
                  setIsProfile(false);
                  setActiveTab(navItem?.route);
                }}
              />
            );
          })}
          {user?.guest ? null : (
            <>
              {sideNavUsers?.length > 0 ? (
                <>
                  <div className={`${styles.seperator} mt-4 mb-4`} />
                  <label
                    className={`${"px-3 mb-2 d-flex w-100 justify-content-start mt-1"}  ${
                      styles.sideNavSubcontainerTitle
                    }  `}
                  >
                    Following
                  </label>
                </>
              ) : null}

              {loading ? (
                <>
                  <div className={`${styles.seperator} mt-4 mb-4`} />
                  <label
                    className={`${"px-3 mb-2 d-flex w-100 justify-content-start mt-1"}  ${
                      styles.sideNavSubcontainerTitle
                    }  `}
                  >
                    Following
                  </label>
                  <BoxLoader iconStyle={styles.loader} />
                  <BoxLoader iconStyle={styles.loader} />
                  <BoxLoader iconStyle={styles.loader} />
                </>
              ) : sideNavUsers?.length ? (
                <>
                  {sideNavUsers?.map((user: any, index: any) => {
                    return (
                      <SideCanvasItem
                        key={index}
                        label={`${user?.first_name} ${user?.last_name}`}
                        Icon={
                          user.avatar
                            ? user?.social_login_id
                              ? user?.avatar
                              : followings?.base_url + user?.avatar
                            : defaultAvatar
                        }
                        user
                        isStreaming={user?.status}
                        active={isProfile && activeTab === user?.route}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(user.route);
                          setIsProfile(true);
                          setActiveTab(user?.route);
                        }}
                        userId={user?.id}
                      />
                    );
                  })}
                  {moreLoad ? (
                    <SideCanvasItem
                      label={"Load more"}
                      Icon={LoadMoreIcon}
                      onClick={loadMore}
                      loading={moreLoader}
                    />
                  ) : (
                    ""
                  )}
                </>
              ) : null}

              <div className={`${styles.seperator} mt-4 mb-4`} />
              <label
                className={`${"px-3 mb-2 d-flex w-100 justify-content-start mt-1"}  ${
                  styles.sideNavSubcontainerTitle
                }  `}
              >
                Gaming
              </label>
              <SideCanvasItem
                label="Settings"
                Icon={SettingIcon}
                active={activeTab === routeConstant.setting.path}
                onClick={() => {
                  setIsOpen(false);
                  navigate(routeConstant.setting.path);
                  setActiveTab(routeConstant.setting.path);
                }}
              />
            </>
          )}

          <div className="mb-3" />
        </div>
      </div>
    </div>
  );
};

export default SideCanvas;
