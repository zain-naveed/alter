import { defaultAvatar, LiveIcon } from "assets";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { roundNum } from "shared/utils/helper";

import styles from "./style.module.scss";

function UserCard({ item, baseURL }: any) {
  const { liveUsers } = useSelector((state: any) => state.root);
  const navigate = useNavigate();
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const handleLiveStream = () => {
    let isLiveStream = liveUsers?.users?.filter((itm: any) => {
      return itm?.user_id === item?.id;
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
    <>
      <div
        className={`d-flex flex-column align-items-center ${styles.userContainer}`}
        role="button"
        onClick={() => {
          navigate(`/profile/${item?.id}`);
        }}
      >
        <div className={`${styles.userIconContainer} my-2`}>
          <img
            src={
              item?.avatar
                ? item?.social_login_id
                  ? item?.avatar
                  : baseURL + item?.avatar
                : defaultAvatar
            }
            alt="user-pic"
            className={styles.userIcon}
          />
          {isStreaming ? (
            <div className={`${styles.liveContainer}`}>
              <LiveIcon />
            </div>
          ) : null}
        </div>
        <label className={styles.title} role="button">
          {item?.first_name} {item?.last_name}
        </label>
        <label className={styles.subtitle} role="button">
          {roundNum(item?.viewers ? item?.viewers : 0, 1)} viewers
        </label>
      </div>
    </>
  );
}

export default React.memo(UserCard);
