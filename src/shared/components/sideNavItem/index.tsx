import { WifiRightIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";

interface NavItemProps {
  label: string;
  Icon: any;
  active: boolean;
  user: boolean;
  onClick: () => void;
  isStreaming: boolean;
  isSideNavBarOpen: boolean;
  loading: boolean;
  userId: any;
}

const SideNavItem = ({
  label,
  Icon,
  active,
  user,
  onClick,
  isSideNavBarOpen,
  loading,
  userId,
}: Partial<NavItemProps>) => {
  const { liveUsers } = useSelector((state: any) => state.root);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const handleLiveStream = () => {
    let isLiveStream = liveUsers?.users?.filter((itm: any) => {
      return itm?.user_id === userId;
    });
    if (isLiveStream?.length > 0) {
      setIsStreaming(true);
    } else {
      setIsStreaming(false);
    }
  };
  useEffect(() => {
    handleLiveStream();
  }, [liveUsers.users]);
  return (
    <div
      className={classNames(
        "d-flex row justify-content-center align-items-center m-0",
        isSideNavBarOpen
          ? styles.sideNavItemContainer
          : styles.shortSideNavItemContainer,
        active ? styles.activeSideNavItem : styles.inActiveSideNavItem
      )}
      role={"button"}
      onClick={!loading ? onClick : () => {}}
    >
      <div
        className={classNames(
          "d-flex p-0  align-self-center align-items-center m-0 px-xl-2"
        )}
      >
        <div
          className={classNames(isSideNavBarOpen && "col-xl-2 ", "col-12 m-0")}
        >
          {loading ? (
            <Spinner
              animation="border"
              size="sm"
              style={{ color: "#6c5dd3" }}
            />
          ) : (
            <>
              {user ? (
                <img
                  src={Icon}
                  className={`${styles.sideNavUserImg}`}
                  alt="user-nav-pic"
                />
              ) : (
                <Icon />
              )}
            </>
          )}
        </div>
        {isSideNavBarOpen && (
          <>
            <div
              className={classNames(
                user ? "col-xl-9" : "col-xl-10",
                "d-none d-xl-flex",
                "align-items-center"
              )}
            >
              <label
                className={classNames(styles.sideListItemLabel, "px-2")}
                role={"button"}
              >
                {label}
              </label>
            </div>
            {user && (
              <div className={classNames("d-none d-xl-flex", "col-1")}>
                {isStreaming ? (
                  <WifiRightIcon className={styles.wifiIcon} />
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SideNavItem;
