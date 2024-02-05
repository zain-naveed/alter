import { NoContentProfile } from "assets";
import classNames from "classnames";
import ShortLoader from "pages/general/feed/shortLoader";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import CustomSelect from "shared/components/customSelect";
import GameCard from "shared/components/gameCard";
import { toastMessage } from "shared/components/toast";
import { GetProfileShort } from "shared/services/userService";
import { delType } from "shared/utils/constants";
import { filters } from "../constant";
import styles from "../streamsList/style.module.scss";
const ShortList = ({
  isSelf,
  userId,
  infiniteScroll,
  setinfiniteScroll,
}: {
  isSelf: boolean;
  userId?: string;
  infiniteScroll: boolean;
  setinfiniteScroll: any;
}) => {
  // const shortRef = useRef(null);
  const [filter, setFilter] = useState<string>(filters[0].label);
  const [shortLists, setShortList] = useState<any>([]);
  const [shortLoader, setShortLoader] = useState<boolean>(false);
  const { id } = useParams();
  const pageRef = useRef<number>(1);
  const shortListRef = useRef<any>([]);

  const getShort = (filtr?: string) => {
    setShortLoader(true);
    if (userId) {
      let filval = filters.filter((ii) => ii.label == filter);
      let query = `/${userId}/${pageRef.current * 8}/${
        filtr ? filtr : filter ? filval[0].value : ""
      }`;
      GetProfileShort(query)
        .then(
          ({
            data: {
              data: { shorts, last_page },
            },
          }) => {
            if (last_page >= pageRef.current) {
              pageRef.current = pageRef.current + 1;
              setinfiniteScroll(false);
            }
            setShortList(shorts);
            shortListRef.current = shorts;
          }
        )
        .catch((err) => {
          console.log("Error", err?.response?.data?.message);
        })
        .finally(() => setShortLoader(false));
    }
  };

  useEffect(() => {
    pageRef.current = 1;
    shortListRef.current = [];
    setShortList([]);
  }, [id]);
  useEffect(() => {
    getShort();
  }, [userId, infiniteScroll]);
  return (
    <div className="w-100">
      <div
        className={classNames(
          "d-flex justify-content-between align-items-center  px-4 px-sm-0"
        )}
      >
        {shortLists?.length ? (
          <>
            {" "}
            <label className={classNames(styles.videosCountLabel)}>
              {shortLists?.length} Video{shortLists?.length > 1 ? "s" : ""} here
            </label>
            <CustomSelect
              options={filters}
              selectionColor={"#808191"}
              containerStyle={styles.selectionStyle}
              inputContainerStyle={styles.inputContainerStyle}
              iconStyle={styles.iconStyle}
              value={filter}
              onChangeHandle={(val) => {
                shortListRef.current = [];
                pageRef.current = 1;
                setShortList([]);
                getShort(val);
                let filval = filters.filter((ii) => ii.value == val);
                setFilter(filval[0].label);
              }}
            />
          </>
        ) : (
          ""
        )}
      </div>
      {!shortLists?.length && shortLoader ? (
        <div
          className={classNames(
            " d-flex row justify-content-sm-start   justify-content-center  align-items-center my-2"
          )}
        >
          <ShortLoader
            count={4}
            isInProfile={true}
            isSelf={isSelf}
            isStream={false}
          />
        </div>
      ) : shortLists?.length ? (
        <div
          className={classNames(
            " d-flex row justify-content-sm-start  justify-content-center  align-items-start my-2"
          )}
        >
          {shortLists?.map((stream: any, ind: number) => {
            return (
              <GameCard
                {...stream}
                key={ind}
                index={ind}
                isInProfile={true}
                isSelf={isSelf}
                DelType={delType.short}
                forceUpdate={() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 700);
                }}
              />
            );
          })}
          {shortLoader ? (
            <ShortLoader
              isInProfile={true}
              isSelf={isSelf}
              isStream={false}
              count={2}
            />
          ) : null}
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center  align-items-center w-100">
          <NoContentProfile />
          <label className={classNames(styles.noContentText, "mt-3")}>
            Oops! No Shorts Yet.
          </label>
        </div>
      )}
    </div>
  );
};

export default ShortList;
