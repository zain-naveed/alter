import { defaultAvatar, NoFollowContent, SearchIcon } from "assets";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import FollowUserLoader from "shared/components/followUserLoader";
import Heading from "shared/components/heading";
import Pagination from "shared/components/pagination";
import { toastMessage } from "shared/components/toast";
import {
  GetUserFollowers,
  removeFollowers,
} from "shared/services/settingsService";
import { classNames } from "shared/utils/helper";
import useDebounce from "shared/hooks/useDebounce";
import styles from "./style.module.scss";

function FollowerList() {
  const [followerList, setFollower] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const { user } = useSelector((state: any) => state.root);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [floading, setfLoading] = useState<number>(-1);
  const [baseUrl, setBaseURL] = useState<string>("");
  const skip = useRef(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const handleFollowers = () => {
    GetUserFollowers(user?.user?.id, skip.current, page, searchValue)
      .then((res) => {
        if (res?.data?.data) {
          setFollower(res?.data?.data?.followers);
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

  const removeFolower = (inx: number) => {
    let cloneFollower = [...followerList];
    let followerInx = cloneFollower.findIndex((ii) => ii.id === inx);
    setfLoading(followerInx);
    const formBody: any = new FormData();
    formBody.append("user_id", inx);
    removeFollowers(formBody)
      .then(({ data: { data, message } }) => {
        if (followerInx > -1) {
          cloneFollower.splice(followerInx, 1);
          setFollower(cloneFollower);
        }
        toastMessage("success", message);
      })
      .catch((err) => {})
      .finally(() => {
        setfLoading(-1);
      });
  };
  const handleSearch = (value: any) => {
    setSearch(value);
  };

  useEffect(() => {
    if (page) {
      setLoading(true);
      handleFollowers();
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
        title="Your followers"
        value={search}
        handleChange={(e: any) => handleSearch(e.target.value)}
      />
      <div
        className={classNames(
          "py-3 d-flex flex-column align-items-center  ",
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
              return (
                <div
                  key={inx}
                  className={classNames(
                    "d-flex justify-content-between py-3 w-100",
                    styles.search_list
                  )}
                >
                  <div
                    className="d-flex align-items-center col-10"
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
                      title="Remove"
                      submitHandle={() => removeFolower(item?.id)}
                      containerStyle={styles.remove}
                      loading={floading == inx ? true : false}
                      spinnerColor={"#6c5dd3"}
                    />
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <NoFollowContent />
            <label className={classNames(styles.noContentStyle, "mt-3")}>
              Oops! No Follower Yet.
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

export default FollowerList;
