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
  loading: boolean;
  userId: any;
}

const SideCanvasItem = ({
  label,
  Icon,
  active,
  user,
  onClick,
  userId,
  loading,
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
        styles.sideCanvasItemContainer,
        active ? styles.activeSideNavItem : styles.inActiveSideNavItem
      )}
      role={"button"}
      onClick={onClick}
    >
      <div
        className={classNames(
          "d-flex align-self-center align-items-center m-0 px-2"
        )}
      >
        <div className={classNames("col-2  m-0")}>
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

        <>
          <div
            className={classNames(
              user ? "col-9" : "col-10",
              "d-flex",
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
            <div className={classNames("d-flex", "col-1")}>
              {isStreaming ? (
                <WifiRightIcon className={styles.wifiIcon} />
              ) : null}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default SideCanvasItem;
