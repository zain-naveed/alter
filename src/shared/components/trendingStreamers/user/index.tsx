import { defaultAvatar } from "assets";
import classNames from "classnames";
import { useNavigate } from "react-router";
import { roundNum } from "shared/utils/helper";
import styles from "./style.module.scss";

interface TrendingUserProps {
  first_name: string;
  last_name: string;
  avatar: string;
  views: string;
  user_name: string;
  base_url: string;
  social_login_id: string;
  id: string;
}

const User = ({
  first_name,
  last_name,
  avatar,
  views,
  user_name,
  base_url,
  social_login_id,
  id,
}: TrendingUserProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames("d-flex mt-4")}
      role="button"
      onClick={() => {
        navigate(`/profile/${id}`);
      }}
    >
      <img
        src={
          avatar
            ? social_login_id
              ? avatar
              : base_url + avatar
            : defaultAvatar
        }
        alt="user-pic"
        className={classNames(styles.photoStyle)}
      />
      <div className="d-flex flex-column ms-3">
        <label className={classNames(styles.userTitle)} role="button">
          {first_name} {last_name}
        </label>
        <label className={classNames(styles.viewerLabel)} role="button">
          @{user_name}
        </label>
        <div className="d-flex align-items-center">
          <div className={classNames(styles.liveDot)} />
          <label
            className={classNames(styles.viewerLabel, "ms-1")}
            role="button"
          >
            {roundNum(views, 1)} viewers
          </label>
        </div>
      </div>
    </div>
  );
};

export default User;
