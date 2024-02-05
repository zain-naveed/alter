import classNames from "classnames";
import Pagination from "shared/components/pagination";
import UserCard from "shared/components/userCard";
import UserCardLoader from "shared/components/userCardLoader";
import NoContent from "../noContent";
import styles from "./style.module.scss";

interface CardProps {
  loading: boolean;
  streamerList: any;
  page: number;
  lastPage: number;
  setPage: (val: number) => void;
}

const StreamerList = ({
  loading,
  streamerList,
  page,
  lastPage,
  setPage,
}: CardProps) => {
  return (
    <>
      {loading ? (
        <div
          className={
            "d-flex flex-wrap  justify-content-start  align-items-start my-4 w-100"
          }
        >
          <UserCardLoader />
          <UserCardLoader />
        </div>
      ) : streamerList.length > 0 ? (
        <div
          className={classNames(
            "d-flex flex-wrap  justify-content-start  align-items-start my-4 w-100",
            styles.minHeight
          )}
        >
          {streamerList.map((user: any, ind: any) => {
            return <UserCard item={user} key={ind} baseURL={user?.base_url} />;
          })}

          {!loading ? (
            <div className={classNames("w-100 mt-3")}>
              <Pagination
                page={page}
                setPage={setPage}
                lastPage={lastPage}
                listSize={streamerList?.length}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <NoContent />
      )}
    </>
  );
};

export default StreamerList;
