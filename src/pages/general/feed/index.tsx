import { NoContentProfile, VideoIcon, WifiRightIcon } from "assets";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/customButton";
import CustomSelect from "shared/components/customSelect";
import CustomSlider from "shared/components/customSlider";
import CustomSliderLoader from "shared/components/customSliderLoader";
import FollowersCard from "shared/components/followersCard";
import GameCard from "shared/components/gameCard";
import NotContents from "shared/default/notContent";
import { feedShort, getLiveStream } from "shared/services/feedService";
import { filterOptions, shortNavigation } from "shared/utils/constants";
import ShortLoader from "./shortLoader";
import styles from "./style.module.scss";

function Feed() {
  const {
    user: { user },
    liveUsers,
  } = useSelector((state: any) => state.root);
  const [streamsFilter, setStreamsFilter] = useState<string>(
    filterOptions[0].label
  );
  const [shortsFilter, setShortsFilter] = useState<string>(
    filterOptions[0].label
  );
  const [shortLoader, setShortLoader] = useState<boolean>(false);
  const [shortPageLoader, setShortPageLoader] = useState<boolean>(false);
  const [shortList, setShortList] = useState<any>([]);
  const [streamLoader, setStreamLoader] = useState<boolean>(false);
  const [streamPageLoader, setStreamPageLoader] = useState<boolean>(false);
  const [streamPage, setStreamPage] = useState<number>(1);
  const [streamTotalPage, setStreamTotalPage] = useState<number>(-1);
  const [streamList, setStreamList] = useState<any>([]);
  const [shortLastPage, setShortLastPage] = useState<number>(-1);
  const [shortPage, setShortPage] = useState<number>(1);
  const [sliderStreams, setSliderStream] = useState<any>([]);
  const [sliderLoader, setSliderLoader] = useState<boolean>(false);
  useEffect(() => {
    getShort(filterOptions[0].value, 1);
    getRecentStream(filterOptions[0].value, streamPage);
  }, []);

  useEffect(() => {
    if (liveUsers.users?.length > 0) {
      setSliderStream(liveUsers.users);
    } else {
      sliderStream();
    }
  }, [liveUsers.users]);

  const getShort = (query: string, page: number, scroll?: any) => {
    if (!scroll) {
      setShortLoader(true);
    } else {
      setShortPageLoader(true);
    }
    feedShort(query, page, 8)
      .then(({ data: { data } }) => {
        setShortPage(page);
        setShortLastPage(data?.last_page);
        if (scroll) {
          let cloneShorts = [...shortList];
          cloneShorts = cloneShorts.concat(data?.shorts);

          setShortList(cloneShorts);
        } else {
          if (data?.shorts?.length) {
            setShortList(data?.shorts);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setShortLoader(false);
        setShortPageLoader(false);
      });
  };
  const getRecentStream = (streamFil: string, page: number, scroll?: any) => {
    if (!scroll) {
      setStreamLoader(true);
    } else {
      setStreamPageLoader(true);
    }
    getLiveStream(8, streamFil, page)
      .then(({ data: { data } }) => {
        setStreamPage(page);
        setStreamTotalPage(data?.last_page);
        if (scroll) {
          let cloneShorts = [...streamList];
          cloneShorts = cloneShorts.concat(data?.streams);

          setStreamList(cloneShorts);
        } else {
          if (data?.streams?.length) {
            setStreamList(data?.streams);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setStreamLoader(false);
        setStreamPageLoader(false);
      });
  };
  const sliderStream = () => {
    setSliderLoader(true);
    getLiveStream(7, filterOptions[2].value, 1)
      .then(({ data: { data } }) => {
        setSliderStream(data?.streams);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSliderLoader(false);
      });
  };

  return (
    <div className={classNames("p-0 w-100")}>
      {sliderLoader ? (
        <CustomSliderLoader />
      ) : (
        <CustomSlider
          streams={sliderStreams}
          isLive={liveUsers.users?.length > 0 ? true : false}
        />
      )}

      <div className={classNames(styles.customContainer, "px-3 my-4")}>
        <div
          className={`d-flex justify-content-between align-items-center px-2`}
        >
          <div className={`d-flex justify-content-start align-items-center`}>
            <WifiRightIcon className={classNames(styles.feedIcon)} />
            <label className={`${styles.feedlabel} ms-2 `}>Live Streams</label>
          </div>
          <div className={classNames(styles.dropDownContainer)}>
            <CustomSelect
              options={filterOptions}
              selectionColor={"#808191"}
              containerStyle={styles.selectionStyle}
              inputContainerStyle={styles.inputContainerStyle}
              iconStyle={styles.iconStyle}
              value={streamsFilter}
              onChangeHandle={(val) => {
                getRecentStream(val, 1);
                let filval = filterOptions.filter((ii) => ii.value == val);
                setStreamsFilter(filval[0].label);
              }}
              // onChangeHandle={(val) => setStreamsFilter(val)}
            />
          </div>
        </div>
        <div
          className={`d-flex flex-wrap justify-content-sm-start   justify-content-center  align-items-center mt-3`}
        >
          {streamLoader ? (
            <ShortLoader
              count={4}
              isInProfile={false}
              isSelf={false}
              isStream={true}
            />
          ) : streamList?.length ? (
            streamList.map((item: any, inx: number) => {
              return (
                <GameCard
                  {...item}
                  isStream={true}
                  index={inx}
                  key={inx}
                  isInProfile={false}
                  isSelf={false}
                  isinFeed={true}
                />
              );
            })
          ) : (
            <NotContents
              Icon={NoContentProfile}
              msg="Oops! No Streams Found yet."
            />
          )}
        </div>
        {streamList?.length ? (
          <>
            {streamTotalPage >= streamPage + 1 ? (
              <div
                className={`d-flex align-items-center justify-content-center mt-5`}
              >
                <CustomButton
                  title="Load more"
                  spinnerColor="#6c5dd3"
                  isDisable={streamPageLoader}
                  loading={streamPageLoader}
                  submitHandle={() => {
                    getRecentStream(shortsFilter, streamPage + 1, "scroll");
                  }}
                  containerStyle={`${styles.customBtnContainer} px-5`}
                />
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}

        <div className="mt-5">
          <FollowersCard
            title={"Streamers You Follow"}
            isHorizontal={true}
            isInFeed={true}
          />
        </div>
        <div
          className={`d-flex justify-content-between align-items-center mt-5 px-2`}
        >
          <div className={`d-flex justify-content-start align-items-center`}>
            <VideoIcon className={styles.titleIcon} />
            <label className={`${styles.feedlabel} ms-2 `}>
              Shorts For You
            </label>
          </div>
          <div className={classNames(styles.dropDownContainer)}>
            <CustomSelect
              options={filterOptions}
              selectionColor={"#808191"}
              containerStyle={styles.selectionStyle}
              inputContainerStyle={styles.inputContainerStyle}
              iconStyle={styles.iconStyle}
              value={shortsFilter}
              onChangeHandle={(val) => {
                getShort(val, 1);
                let filval = filterOptions.filter((ii) => ii.value == val);
                setShortsFilter(filval[0].label);
              }}
              // onChangeHandle={(val) => setShortsFilter(val)}
            />
          </div>
        </div>
        <div
          className={` d-flex flex-wrap justify-content-sm-start   justify-content-center  align-items-center mt-3`}
        >
          {shortLoader ? (
            <ShortLoader
              count={4}
              isInProfile={false}
              isSelf={false}
              isStream={false}
            />
          ) : shortList.length ? (
            shortList.map((item: any, inx: number) => {
              return (
                <GameCard
                  {...item}
                  key={inx}
                  index={inx}
                  isInProfile={false}
                  isSelf={false}
                  shortsFilter={shortsFilter}
                  navigateType={shortNavigation.short}
                />
              );
            })
          ) : (
            <NotContents msg="Oops! No Short Found yet." />
          )}
        </div>
        {!shortLoader && shortList.length ? (
          <>
            {shortLastPage >= shortPage + 1 ? (
              <div
                className={`d-flex align-items-center justify-content-center my-5`}
              >
                <CustomButton
                  spinnerColor="#6c5dd3"
                  title="Load more"
                  isDisable={shortPageLoader}
                  loading={shortPageLoader}
                  submitHandle={() => {
                    getShort(shortsFilter, shortPage + 1, "scroll");
                  }}
                  containerStyle={`${styles.customBtnContainer} px-5`}
                />
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default React.memo(Feed);
