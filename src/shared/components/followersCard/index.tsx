import {
  LeftArrowIcon,
  LoadMoreIcon,
  NoFollowContent,
  RightArrowIcon,
  UserIcon,
} from "assets";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/customButton";
import {
  getTopStreamers,
  getTopUserFollowers,
} from "shared/services/feedService";
import { classNames } from "shared/utils/helper";
import { toastMessage } from "../toast";
import UserCard from "../userCard";
import UserCardLoader from "../userCardLoader";
import styles from "./style.module.scss";
import NotContents from "shared/default/notContent";

interface FollowersCardProps {
  title: string;
  isHorizontal: boolean;
  isInFeed: boolean;
}

const FollowersCard = ({
  isHorizontal,
  isInFeed,
}: Partial<FollowersCardProps>) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const skip = useRef(8);
  const page = useRef(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const [moreHorizonLoader, setHorizonMoreLoader] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(false);
  const [followingsList, setFollowingList] = useState<any>([]);
  const [moreLoad, setMoreLoad] = useState<boolean>(false);
  const [isScrollLeft, setIsScrollLeft] = useState<boolean>(false);
  const scrollRight = () => {
    let elem: any = document.getElementById("followerSubContainer");
    let width: any = document.getElementById(
      "followerSubContainer"
    )?.clientWidth;
    elem.scrollLeft = elem?.scrollLeft + width;
    var eleme = document.getElementById("followerSubContainer");
    var newScrollLeft: any = eleme?.scrollLeft;
    var widthh: any = eleme?.offsetWidth;
    var scrollWidth: any = eleme?.scrollWidth;
    if (Math.trunc(widthh + newScrollLeft) == scrollWidth) {
      setScrollEnd(true);
      if (moreLoad) {
        skip.current = skip.current + 8;
        setHorizonMoreLoader(true);
        handleTopStreamers();
      }
    } else {
      setScrollEnd(false);
    }
  };
  const scrollLeft = () => {
    let elem: any = document.getElementById("followerSubContainer");
    let width: any = document.getElementById(
      "followerSubContainer"
    )?.clientWidth;
    elem.scrollLeft = elem.scrollLeft - width;
    setScrollEnd(false);
  };

  useEffect(() => {
    let elem: any = document.getElementById("followerSubContainer");
    var newScrollLeft: any = elem?.scrollLeft;
    var widthh: any = elem?.offsetWidth;
    var scrollWidth: any = elem?.scrollWidth;
    if (Math.trunc(widthh + newScrollLeft) == scrollWidth) {
      setScrollEnd(true);
    }
    console.log("elem.scrollLeft", elem.scrollLeft);
    elem?.addEventListener("scroll", () => {
      if (elem.scrollLeft !== 0) {
        setIsScrollLeft(true);
      } else {
        setIsScrollLeft(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!moreHorizonLoader) {
      let elem: any = document.getElementById("followerSubContainer");
      let width: any = document.getElementById(
        "followerSubContainer"
      )?.clientWidth;
      elem.scrollLeft = elem?.scrollLeft + width;
    }
  }, [moreHorizonLoader]);

  const handleTopStreamers = () => {
    if (isInFeed) {
      getTopStreamers(user?.id, page.current, skip.current)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            setFollowingList(data?.top_streamers);
            if (data?.last_page > 1) {
              setMoreLoad(true);
            } else {
              setMoreLoad(false);
            }
          } else {
            toastMessage("Error", message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
          setMoreLoader(false);
          setHorizonMoreLoader(false);
        });
    } else {
      getTopUserFollowers(user?.id, page.current, skip.current)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            setFollowingList(data?.followings);
            if (data?.last_page > 1) {
              setMoreLoad(true);
            } else {
              setMoreLoad(false);
            }
          } else {
            toastMessage("Error", message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
          setMoreLoader(false);
          setHorizonMoreLoader(false);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    handleTopStreamers();
  }, []);

  return (
    <div
      className={classNames("px-4 py-4", styles?.followersContainer)}
      id="followersContainer"
    >
      <div
        className={classNames(
          "d-flex justify-content-between align-items-center row m-0 p-0"
        )}
      >
        <div
          className={classNames(
            "d-flex justify-content-start align-items-center  p-0",
            isHorizontal ? "col-md-11 col-10" : "col-12"
          )}
        >
          <UserIcon className={classNames(styles.feedIcon2)} />
          <label className={`${styles.feedlabel} ms-2 `}>
            {isInFeed
              ? "Top Streamers You Should Follow"
              : "From Streamers You Follow"}
          </label>
        </div>
        {isHorizontal && (
          <div
            className={classNames(
              "d-flex justify-content-evenly align-items-center p-0",
              isHorizontal ? "col-md-1 col-2" : ""
            )}
          >
            <div
              className={classNames(
                !isScrollLeft && styles.arrowIconDisable,
                styles.arrowIconContainer
              )}
              onClick={scrollLeft}
            >
              <LeftArrowIcon />
            </div>
            <div
              className={classNames(
                scrollEnd && !moreLoad && styles.arrowIconDisable,
                styles.arrowIconContainer
              )}
              onClick={() => {
                if (!moreHorizonLoader) {
                  scrollRight();
                }
              }}
            >
              {moreHorizonLoader ? (
                <Spinner
                  animation="border"
                  size="sm"
                  style={{
                    color: "white",
                    height: "10px",
                    width: "10px",
                    stroke: "0px",
                  }}
                />
              ) : (
                <RightArrowIcon />
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={classNames(
          "d-flex justify-content-start my-4",
          isHorizontal
            ? styles.followerSubContainer
            : styles.followerVerticalSubContainer
        )}
        id="followerSubContainer"
      >
        {loading ? (
          <>
            <UserCardLoader />
            <UserCardLoader />
            <UserCardLoader />
          </>
        ) : (
          <>
            {followingsList?.length > 0 ? (
              followingsList?.map((user: any, ind: any) => {
                return (
                  <UserCard item={user} key={ind} baseURL={user?.base_url} />
                );
              })
            ) : (
              <div
                className={classNames(
                  "d-flex flex-column w-100 justify-content-center align-items-center"
                )}
              >
                <NoFollowContent />
                <label className={classNames(styles.noContentStyle, "mt-3")}>
                  Oops! Nothing here.
                </label>
              </div>
            )}
          </>
        )}
      </div>
      {!isHorizontal && !loading ? (
        <div
          className={classNames(
            "d-flex justify-content-center align-items-center"
          )}
        >
          {moreLoad ? (
            <CustomButton
              title={"Load more"}
              Icon={LoadMoreIcon}
              containerStyle={styles.customBtnContainer}
              iconStyle={styles.arrowIconStyle}
              loading={moreLoader}
              isDisable={moreLoader}
              spinnerColor={"#6c5dd3"}
              submitHandle={() => {
                skip.current = skip.current + 8;
                setMoreLoader(true);
                handleTopStreamers();
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default FollowersCard;
