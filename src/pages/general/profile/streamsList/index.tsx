import { NoContentProfile } from "assets";
import classNames from "classnames";
import ShortLoader from "pages/general/feed/shortLoader";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import CustomSelect from "shared/components/customSelect";
import GameCard from "shared/components/gameCard";
import { toastMessage } from "shared/components/toast";
import { recentStream } from "shared/services/feedService";
import { delType } from "shared/utils/constants";
import { filters } from "../constant";
import styles from "./style.module.scss";

const StreamList = ({
  isSelf,
  userId,
  infiniteScroll,
  setinfiniteScroll,
}: {
  streamList: Array<any>;
  isSelf: boolean;
  userId?: string;
  infiniteScroll: boolean;
  setinfiniteScroll: any;
}) => {
  const { id } = useParams();
  const [filter, setFilter] = useState<string>(filters[0].label);
  const [streamLists, setStreamList] = useState<any>([]);
  const [streamLoader, setStreamLoader] = useState<boolean>(false);
  const pageRef = useRef<number>(1);
  const streamListRef = useRef<any>([]);

  const getStream = (filtr?: string) => {
    setStreamLoader(true);
    if (userId) {
      let filval = filters.filter((ii) => ii.label == filter);
      let query = `${filtr ? filtr : filter ? filval[0].value : ""}`;
      recentStream(userId, pageRef.current * 8, query)
        .then(({ data: { data } }) => {
          if (data.last_page >= pageRef.current) {
            setinfiniteScroll(false);
            pageRef.current = pageRef.current + 1;
          }
          setStreamList(data.recent_streams);
          streamListRef.current = data.recent_streams;
        })
        .catch((err) => {
          console.log("Error", err?.response?.data?.message);
        })
        .finally(() => setStreamLoader(false));
    }
  };

  useEffect(() => {
    pageRef.current = 1;
    streamListRef.current = [];
    setStreamList([]);
  }, [id]);

  useEffect(() => {
    let filval = filters.filter((ii) => ii.label == filter);
    getStream(filval[0].value);
  }, [id, infiniteScroll]);

  return (
    <div className="w-100">
      {!streamLists?.length && streamLoader ? (
        <div
          className={classNames(
            " d-flex row justify-content-sm-start   justify-content-center  align-items-center my-2"
          )}
        >
          {" "}
          <ShortLoader
            count={4}
            isInProfile={true}
            isSelf={isSelf}
            isStream={false}
          />
        </div>
      ) : streamLists?.length ? (
        <>
          <div
            className={classNames(
              "d-flex justify-content-between align-items-center  px-4 px-sm-0"
            )}
          >
            <label className={classNames(styles.videosCountLabel)}>
              {streamLists?.length} Video{streamLists?.length > 1 ? "s" : ""}{" "}
              here
            </label>
            <CustomSelect
              options={filters}
              selectionColor={"#808191"}
              containerStyle={styles.selectionStyle}
              inputContainerStyle={styles.inputContainerStyle}
              iconStyle={styles.iconStyle}
              value={filter}
              onChangeHandle={(val) => {
                pageRef.current = 1;
                streamListRef.current = [];
                setStreamList([]);
                getStream(val);
                let filval = filters.filter((ii) => ii.value == val);
                setFilter(filval[0].label);
              }}
            />
          </div>
          <div
            className={` d-flex row justify-content-sm-start   justify-content-center  align-items-center my-2 `}
          >
            {streamLists?.map((stream: any, ind: number) => {
              return (
                <GameCard
                  {...stream}
                  key={ind}
                  isStream={true}
                  isInProfile={true}
                  isSelf={isSelf}
                  DelType={delType.stream}
                  forceUpdate={() => {
                    setTimeout(() => {
                      window.location.reload();
                    }, 700);
                  }}
                  // forceUpdate={() => {
                  //   window.location.reload()
                  //   // setForceUpdate(!forceUpdate);
                  //   // setPage(1);
                  //   // setStreamList([]);
                  // }}
                />
              );
            })}
            {streamLoader ? (
              <ShortLoader
                isInProfile={true}
                isSelf={isSelf}
                isStream={false}
                count={2}
              />
            ) : null}
          </div>
        </>
      ) : (
        <div className="d-flex flex-column justify-content-center  align-items-center w-100">
          <NoContentProfile />
          <label className={classNames(styles.noContentText, "mt-3")}>
            Oops! No Streams Yet.
          </label>
        </div>
      )}
    </div>
  );
};

export default StreamList;
