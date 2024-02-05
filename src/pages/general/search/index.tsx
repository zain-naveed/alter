import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomTab from "shared/components/customTab";
import Heading from "shared/components/heading";
import Title from "shared/components/title";
import { toastMessage } from "shared/components/toast";
import { globalSearch } from "shared/services/searchService";
import { classNames } from "shared/utils/helper";
import { tabEnum, tabs } from "./constant";
import ShortList from "./shorts";
import StreamList from "./streams";
import styles from "./style.module.scss";
import StreamerList from "./users";
interface Props {}

function Search(props: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const handleActiveTab = (val: string) => {
    setActiveTab(val);
  };
  const { search } = useSelector((state: any) => state.root);
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [SlastPage, setSLastPage] = useState<number>(0);
  const [spage, setSPage] = useState<number>(1);
  const [lastStmrPage, setLastStmrPage] = useState<number>(0);
  const [Stmrpage, setStmrPage] = useState<number>(1);
  const [lastShortPage, setLastShortPage] = useState<number>(0);
  const [Shortpage, setShortPage] = useState<number>(1);
  const searchStream = () => {
    let type = "";
    let skip = 10;
    if (activeTab === tabEnum.Streamers) {
      type = "user";
      skip = 24;
    } else if (activeTab === tabEnum.Shorts) {
      type = "short";
      skip = 12;
    } else if (activeTab === tabEnum.Streamings) {
      type = "stream";
      skip = 12;
    }
    let formData = new FormData();
    formData.append("search_text", search?.text);
    formData.append("type", type);
    formData.append("pagination", String(skip));
    let page =
      tabEnum.Streamings == activeTab
        ? spage
        : tabEnum.Streamers == activeTab
        ? Stmrpage
        : Shortpage;
    globalSearch(page, formData)
      .then(
        ({
          data: {
            data: { list, last_page },
            status,
            message,
          },
        }) => {
          if (status) {
            setSLastPage(last_page);
            setLastStmrPage(last_page);
            setLastShortPage(last_page);
            setList(list);
          } else {
            toastMessage("Error", message);
          }
        }
      )
      .catch((err) => {
        toastMessage("Error", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (spage && Stmrpage && Shortpage) {
      setLoading(true);
      searchStream();
    }
  }, [search?.text, spage, Stmrpage, Shortpage, activeTab]);
  return (
    <>
      <SearchHeader resultCount={list?.length} />
      <div className={styles.tab_container}>
        <CustomTab
          isFull={true}
          tabs={tabs}
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
          firstTabMargin={styles.tab_margin}
          isLeft
        />
      </div>
      <div
        className={classNames(
          styles.customContainer,
          styles.contentContainer,
          "px-xl-4 px-lg-3 px-0 mt-0 w-100 d-flex ",
          tabEnum.Streamers === activeTab
            ? loading || list.length > 0
              ? "align-items-start"
              : "align-items-center"
            : "align-items-center"
        )}
      >
        {tabEnum.Streamings === activeTab ? (
          <StreamList
            loading={loading}
            page={spage}
            lastPage={SlastPage}
            setPage={setSPage}
            streamList={list}
          />
        ) : tabEnum.Streamers === activeTab ? (
          <StreamerList
            loading={loading}
            page={Stmrpage}
            lastPage={lastStmrPage}
            setPage={setStmrPage}
            streamerList={list}
          />
        ) : tabEnum.Shorts === activeTab ? (
          <ShortList
            loading={loading}
            page={Shortpage}
            lastPage={lastShortPage}
            setPage={setShortPage}
            shortsList={list}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
const SearchHeader = ({ resultCount }: { resultCount: number }) => {
  const { search } = useSelector((state: any) => state.root);
  return (
    <>
      <div>
        <div className={styles.search_result_container}>
          <div className="d-flex">
            <Heading
              title="Search Results"
              headingStyle={styles.headingStyle}
            />
            {search.text ? (
              <div className={styles.paddingLeft}>
                <Heading
                  title={`“${search.text}”`}
                  headingStyle={styles.headingStyle}
                />
              </div>
            ) : null}
          </div>
          <Title
            title={`${resultCount ? resultCount : "0"} results found`}
            titleStyle={styles.titleStyle}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
