import { defaultAvatar, NoFollowContent, SearchIcon } from "assets";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import FollowUserLoader from "shared/components/followUserLoader";
import Heading from "shared/components/heading";
import Pagination from "shared/components/pagination";
import { toastMessage } from "shared/components/toast";
import { setFollowings } from "shared/redux/reducers/followingSlice";
import {
  FollowUser,
  GetUserFollowing,
  UnFollowUser,
} from "shared/services/userService";
import { classNames } from "shared/utils/helper";
import useDebounce from "shared/hooks/useDebounce";
import styles from "./style.module.scss";

function FollowingList() {
  const [followerList, setFollower] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const { user } = useSelector((state: any) => state.root);
  const [lastPage, setLastPage] = useState<number>(1);
  const [baseUrl, setBaseURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const skip = useRef(10);
  const [page, setPage] = useState(1);
  const handleFollowing = () => {
    GetUserFollowing(user?.user?.id, skip.current, page, searchValue)
      .then((res) => {
        if (res?.data?.data) {
          setFollower(res?.data?.data?.followings);
          setLastPage(res?.data?.data?.last_page);
          setBaseURL(res?.data?.data?.base_url);
        } else {
          toastMessage("Error", res.data.message);
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (value: any) => {
    setSearch(value);
  };

  useEffect(() => {
    if (page) {
      setLoading(true);
      handleFollowing();
    }
  }, [page, searchValue]);

  useDebounce(
    () => {
      setSearchValue(search);
    },
    [search],
    800
  );

  return (
    <div className={classNames("py-4")}>
      <SearchHeader
        title="Streamers you follow"
        value={search}
        handleChange={(e: any) => handleSearch(e.target.value)}
      />
      <div
        className={classNames(
          "py-3 d-flex flex-column align-items-center   ",
          styles.followerContainer,
          followerList?.length > 0
            ? " justify-content-start"
            : " justify-content-center"
        )}
      >
        {loading ? (
          <>
            <FollowUserLoader />
            <FollowUserLoader />
            <FollowUserLoader />
          </>
        ) : followerList?.length > 0 ? (
          <>
            {followerList.map((item: any, inx: number) => {
              return <UserCard item={item} key={inx} baseUrl={baseUrl} />;
            })}
          </>
        ) : (
          <>
            <NoFollowContent />
            <label className={classNames(styles.noContentStyle, "mt-3")}>
              Oops! Nothing here.
            </label>
          </>
        )}
      </div>
      {!loading ? (
        <>
          {lastPage > 1 ? (
            <div className={classNames("w-100")}>
              <Pagination
                page={page}
                setPage={setPage}
                lastPage={lastPage}
                listSize={followerList?.length}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
const SearchHeader = (props: {
  title: string;
  value: string;
  handleChange: any;
}) => {
  const { title, value, handleChange } = props;
  return (
    <div
      className={classNames(
        "d-flex justify-content-between align-items-sm-center",
        styles.header_container
      )}
    >
      <Heading title={title} headingStyle={styles.search_heading} />
      <div className={styles.search_container}>
        <SearchIcon />
        <input
          type={"text"}
          value={value}
          onChange={handleChange}
          placeholder="Search streamer"
        />
      </div>
    </div>
  );
};

const UserCard = ({ item, baseUrl }: any) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { followings } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRemoveFollow = () => {
    setLoading(true);
    if (!isFollowing) {
      let formData = new FormData();
      formData.append("user_id", item?.id);
      FollowUser(formData)
        .then(({ data: { data, message } }) => {
          if (data?.status) {
            let cloneArr = [...followings?.followings];
            cloneArr.push(data?.followee);
            dispatch(
              setFollowings({
                followings: cloneArr,
                base_url: followings?.base_url,
              })
            );
            setIsFollowing(true);
            toastMessage("success", message);
          } else {
            toastMessage("Error", message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      let formData = new FormData();
      formData.append("user_id", item?.id);

      UnFollowUser(formData)
        .then((res) => {
          let cloneFollowing = followings?.followings.filter(
            (itm: any, inx: any) => {
              return itm?.id != item?.id;
            }
          );
          dispatch(
            setFollowings({
              followings: cloneFollowing,
              base_url: followings?.base_url,
            })
          );
          setIsFollowing(false);
          toastMessage("success", res?.data?.message);
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div
      className={classNames(
        "d-flex justify-content-between py-3 w-100",
        styles.search_list
      )}
    >
      <div
        className={classNames("d-flex align-items-center col-10")}
        onClick={() => navigate(`/profile/${item?.id}`)}
        role={"button"}
      >
        <img
          src={
            item?.avatar
              ? item?.social_login_id
                ? item?.avatar
                : baseUrl + item?.avatar
              : defaultAvatar
          }
          className={styles.image}
          alt="user-pic"
        />
        <label className={styles.avatar_name} role={"button"}>
          {item.first_name} {item.last_name}
        </label>
      </div>
      <div
        className={classNames(
          "col-2 m-0 d-flex justify-content-end align-items-center"
        )}
      >
        <CustomButton
          title={isFollowing ? "Following" : "Follow"}
          submitHandle={handleRemoveFollow}
          containerStyle={isFollowing ? styles.following : styles.follow}
          isDisable={loading}
          loading={loading}
          spinnerColor={isFollowing ? "#6c5dd3" : "white"}
        />
      </div>
    </div>
  );
};

export default FollowingList;
