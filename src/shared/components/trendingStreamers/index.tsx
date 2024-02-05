import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { trendingStreamers } from "shared/services/streamService";
import CustomButton from "../customButton";
import styles from "./style.module.scss";
import User from "./user";
import UserLoader from "./userLoader";
const TrendingStreamer = () => {
  const [streamers, setStreamers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const skip = useRef(4);
  const page = useRef(1);
  const handleStreamers = () => {
    trendingStreamers(skip.current, page.current)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          setStreamers(data?.trending_streamers);
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
        setMoreLoader(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    handleStreamers();
  }, []);

  return (
    <div
      className={classNames(
        "py-4 px-4 d-flex flex-column",
        styles.topLevelcontainer
      )}
    >
      <label className={classNames(styles.title)}>Trending Streamers</label>
      {loading ? (
        <>
          <UserLoader />
          <UserLoader />
          <UserLoader />
          <UserLoader />
        </>
      ) : (
        streamers.map((user: any, ind: any) => {
          return <User {...user} key={ind} />;
        })
      )}
      <CustomButton
        title="Discover More"
        containerStyle={classNames("mt-4", styles.btnStyle)}
        submitHandle={() => {
          skip.current = skip.current + 4;
          setMoreLoader(true);
          handleStreamers();
        }}
        loading={moreLoader}
        isDisable={moreLoader}
        spinnerColor={"#1b1d21"}
      />
    </div>
  );
};

export default TrendingStreamer;
