import classNames from "classnames";
import GameCard from "shared/components/gameCard";
import GameCardLoader from "shared/components/gameCardLoader";
import Pagination from "shared/components/pagination";
import NoContent from "../noContent";

interface CardProps {
  loading: boolean;
  streamList: any;
  page: number;
  lastPage: number;
  setPage: (val: number) => void;
}

const StreamList = ({
  loading,
  streamList,
  page,
  lastPage,
  setPage,
}: CardProps) => {
  return (
    <>
      {loading ? (
        <div
          className={`d-flex flex-wrap justify-content-sm-start justify-content-center  align-items-center my-4 w-100`}
        >
          <GameCardLoader isInProfile={false} isSelf={false} isStream={true} />
          <GameCardLoader isInProfile={false} isSelf={false} isStream={true} />
        </div>
      ) : streamList.length > 0 ? (
        <div
          className={`d-flex flex-wrap justify-content-sm-start justify-content-center  align-items-center my-4 w-100`}
        >
          {streamList.map((stream: any, ind: any) => {
            return (
              <GameCard
                {...stream}
                key={ind}
                isInProfile={false}
                isStream={true}
                isinFeed={true}
              />
            );
          })}

          {!loading ? (
            <div className={classNames("w-100 mt-3")}>
              <Pagination
                page={page}
                setPage={setPage}
                lastPage={lastPage}
                listSize={streamList?.length}
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

export default StreamList;
