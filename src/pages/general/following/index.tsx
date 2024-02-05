import { NoContentProfile, WifiRightIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/customButton";
import CustomSelect from "shared/components/customSelect";
import FollowersCard from "shared/components/followersCard";
import GameCard from "shared/components/gameCard";
import GameCardLoader from "shared/components/gameCardLoader";
import NotContents from "shared/default/notContent";
import { getUserLiveStream } from "shared/services/feedService";
import { filterOptions } from "shared/utils/constants";
import styles from "../feed/style.module.scss";

const Following = () => {
  const [streamsFilter, setStreamsFilter] = useState<string>(
    filterOptions[0].label
  );
  const [streamLoader, setStreamLoader] = useState<boolean>(false);
  const [streamPageLoader, setStreamPageLoader] = useState<boolean>(false);
  const [streamPage, setStreamPage] = useState<number>(1);
  const [streamTotalPage, setStreamTotalPage] = useState<number>(-1);
  const [streamList, setStreamList] = useState<any>([]);
  const getRecentStream = (streamFil: string, page: number, scroll?: any) => {
    if (!scroll) {
      setStreamLoader(true);
    } else {
      setStreamPageLoader(true);
    }
    getUserLiveStream(10, streamFil, page)
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
  useEffect(() => {
    getRecentStream(filterOptions[0].value, streamPage);
  }, []);
  return (
    <div
      className={classNames(
        styles.customContainer,
        "px-2 px-md-2 px-xl-5  my-3 w-100"
      )}
    >
      <div className="mt-5">
        <FollowersCard title={" From Streamers You Follow"} />
      </div>
      <div
        className={`d-flex justify-content-between align-items-center px-2 mt-5 mb-4 `}
      >
        <div className={`d-flex justify-content-start align-items-center`}>
          <WifiRightIcon className={classNames(styles.feedIcon)} />
          <label className={`${styles.feedlabel} ms-2 `}>
            Following Streams
          </label>
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
          />
        </div>
      </div>
      <div
        className={`d-flex flex-wrap justify-content-sm-start  justify-content-center  align-items-center`}
      >
        {streamLoader ? (
          ["", "", "", ""].map((item: any, inx: number) => {
            return (
              <GameCardLoader
                key={`following-strream-${inx}`}
                isStream={true}
                isInProfile={false}
                isSelf={false}
              />
            );
          })
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
                  getRecentStream(streamsFilter, streamPage + 1, "scroll");
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
  );
};

export default Following;
