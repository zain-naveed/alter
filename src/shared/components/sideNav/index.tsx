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
import SideNavItem from "../sideNavItem";
import styles from "./style.module.scss";

interface SideNavProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  sideNavUsers: any;
  loading: boolean;
  moreLoader: boolean;
  moreLoad: boolean;
  loadMore: () => void;
}

const SideNav = ({
  isOpen,
  setIsOpen,
  loading,
  sideNavUsers,
  moreLoader,
  moreLoad,
  loadMore,
}: Partial<SideNavProps>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(location?.pathname);
  const [isProfile, setIsProfile] = useState<boolean>(false);
  const [defaultUserCount, setDefaultUserCount] = useState<number>(0);
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

  const [navigationItems] = useState<
    { label: string; Icon: any; route: string }[]
  >(
    user?.guest || !user?.user?.token
      ? guestNavigationItems
      : publicNavigationItems
  );

  const handleRoute = () => {
    if (location?.pathname === navigationItems[3]?.route) {
      setIsProfile(false);
    } else if (location?.pathname.includes("profile")) {
      setIsProfile(true);
    } else {
      setIsProfile(false);
    }
  };

  useEffect(() => {
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
    <>
      <nav
        className={classNames(
          isOpen
            ? "justify-content-center justify-content-xl-between"
            : "justify-content-center",
          styles.logoContainer,
          "d-flex align-items-center w-100 p-4"
        )}
      >
        <Logo
          className={`${isOpen ? "d-none d-xl-flex" : "d-none"} `}
          role="button"
          onClick={() => {
            navigate(routeConstant.feed.path);
          }}
        />
        <HamburgerIcon
          role={"button"}
          onClick={() => {
            setIsOpen?.(!isOpen);
          }}
        />
      </nav>
      <div
        className={classNames(
          "container d-flex  flex-column",
          styles.contentContainer,
          "px-lg-3"
        )}
      >
        <label
          className={`${
            isOpen
              ? "px-xl-3 mb-2 d-flex w-100 justify-content-center justify-content-xl-start mt-1"
              : "mb-2 d-flex w-100 justify-content-center mt-1"
          }  ${styles.sideNavSubcontainerTitle}  `}
        >
          <label
            className={`${isOpen ? "d-none d-xl-block me-1" : "d-none me-1"} `}
          >
            Global
          </label>
          Feeds
        </label>
        {navigationItems?.map((navItem, index) => {
          return (
            <SideNavItem
              key={index}
              label={navItem.label}
              Icon={navItem.Icon}
              active={!isProfile && location?.pathname === navItem?.route}
              onClick={() => {
                navigate(navItem.route);
                setIsProfile(false);
                setActiveTab(navItem?.route);
              }}
              isSideNavBarOpen={isOpen}
            />
          );
        })}
        {user?.guest || !user?.user?.token ? null : (
          <>
            {sideNavUsers?.length ? (
              <>
                <div className={`${styles.seperator} mt-4 mb-4`} />
                <label
                  className={`${
                    isOpen
                      ? "px-xl-3 mb-2 d-flex w-100 justify-content-center justify-content-xl-start mt-1"
                      : "mb-2 d-flex w-100 justify-content-center mt-1"
                  }  ${styles.sideNavSubcontainerTitle}  `}
                >
                  Following
                </label>
              </>
            ) : null}

            {loading ? (
              <>
                <div className={`${styles.seperator} mt-4 mb-4`} />
                <label
                  className={`${
                    isOpen
                      ? "px-xl-3 mb-2 d-flex w-100 justify-content-center justify-content-xl-start mt-1"
                      : "mb-2 d-flex w-100 justify-content-center mt-1"
                  }  ${styles.sideNavSubcontainerTitle}  `}
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
                  if (index < defaultUserCount) {
                    return (
                      <SideNavItem
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
                        isSideNavBarOpen={isOpen}
                        active={
                          isProfile && activeTab === `/profile/${user?.id}`
                        }
                        onClick={() => {
                          navigate(`/profile/${user?.id}`);
                          setIsProfile(true);
                          setActiveTab(`/profile/${user?.id}`);
                        }}
                        userId={user?.id}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
                {moreLoad ? (
                  <SideNavItem
                    label={"Load more"}
                    Icon={LoadMoreIcon}
                    onClick={loadMore}
                    isSideNavBarOpen={isOpen}
                    loading={moreLoader}
                  />
                ) : null}
              </>
            ) : null}

            <div className={`${styles.seperator} mt-4 mb-4`} />
            <label
              className={`${
                isOpen
                  ? "px-xl-3 mb-2 d-flex w-100 justify-content-center justify-content-xl-start mt-1"
                  : "mb-2 d-flex w-100 justify-content-center mt-1"
              }  ${styles.sideNavSubcontainerTitle}  `}
            >
              Gaming
            </label>
            <SideNavItem
              label="Settings"
              Icon={SettingIcon}
              isSideNavBarOpen={isOpen}
              active={activeTab === routeConstant.setting.path}
              onClick={() => {
                navigate(routeConstant.setting.path);
                setActiveTab(routeConstant.setting.path);
              }}
            />
          </>
        )}

        <div className="mb-3" />
      </div>
    </>
  );
};

export default SideNav;
