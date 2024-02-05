import classNames from "classnames";
import GameCard from "shared/components/gameCard";
import GameCardLoader from "shared/components/gameCardLoader";
import Pagination from "shared/components/pagination";
import { shortNavigation } from "shared/utils/constants";
import NoContent from "../noContent";

interface CardProps {
  loading: boolean;
  shortsList: any;
  page: number;
  lastPage: number;
  setPage: (val: number) => void;
}

const ShortList = ({
  loading,
  shortsList,
  page,
  lastPage,
  setPage,
}: CardProps) => {
  return (
    <>
      {loading ? (
        <div
          className={
            "d-flex flex-wrap justify-content-md-start justify-content-center align-items-center my-4 w-100"
          }
        >
          <GameCardLoader isInProfile={false} isSelf={false} isStream={false} />
          <GameCardLoader isInProfile={false} isSelf={false} isStream={false} />
        </div>
      ) : shortsList.length > 0 ? (
        <div
          className={
            "d-flex flex-wrap justify-content-md-start justify-content-center align-items-center my-4 w-100"
          }
        >
          {shortsList.map((stream: any, ind: any) => {
            
            return <GameCard index={ind} navigateType={shortNavigation.search} {...stream} key={ind} isInProfile={false} />;
          })}

          {!loading ? (
            <div className={classNames("w-100 mt-3")}>
              <Pagination
                page={page}
                setPage={setPage}
                lastPage={lastPage}
                listSize={shortsList?.length}
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

export default ShortList;
