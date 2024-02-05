import classNames from "classnames";
import React, { useEffect, useState, useRef } from "react";
import ShortCard from "shared/components/shortCard";
import ShortLoader from "shared/components/shortLoader";
import styles from "./style.module.scss";
import { feedShort } from "shared/services/feedService";
import { addShortRectn, delShortRectn } from "shared/services/shortService";
import NotContents from "shared/default/notContent";
import { shortReaction } from "shared/utils/constants";
import "./short.css";
import videojs from "video.js";
import $ from "jquery";
import { useDispatch } from "react-redux";
import { setShortOptions } from "shared/redux/reducers/shortSlice";

const Shorts = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [shortList, setShortList] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [skipShort, setskipShort] = useState<number>(10);
  const [stopInfinte, setStopInfinite] = useState<boolean>(true);
  const contentRef = useRef(null);
  useEffect(() => {
    let doc: any = window.document.getElementById("mainContainer");
    let nested: any = window.document.getElementById("scroll");

    if (doc) {
      doc.style.overflowY = "visible";
      nested.style.overflowY = "scroll";
      nested.style.overflowX = "hidden";
      nested.style.height = "calc(100vh - 81px)";
    }
  });
  useEffect(() => {
    getAllShort();
  }, []);
  const getAllShort = () => {
    setLoading(true);
    feedShort("", page, skipShort)
      .then(
        ({
          data: {
            data: { shorts },
          },
        }) => {
          if (!shorts.length) {
            setStopInfinite(false);
          }
          if (shorts.length) {
            let cloneShorts = [...shortList];
            cloneShorts = [...cloneShorts, ...shorts];
            setShortList(cloneShorts);
          }
          setPage(page + 1);
        }
      )
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onReachEnd = () => {
    let checkHeight = (contentRef.current as any)?.scrollHeight;
    let onReachEnd =
      (contentRef.current as any)?.scrollTop +
      (contentRef.current as any)?.clientHeight;
    if (onReachEnd == checkHeight && stopInfinte) {
      getAllShort();
    }
  };
  const handleAddReaction = (obj: any) => {
    addShortRectn(obj)
      .then(({ data }) => {
        let cloneShorts = [...shortList];
        let shortIndex = cloneShorts.findIndex((ii) => ii.id === obj.short_id);
        if (shortIndex > -1) {
          if (shortReaction.views == obj.type) {
            if (!cloneShorts[shortIndex].is_viewed) {
              cloneShorts[shortIndex].views += 1;
            }
          } else if (shortReaction.like == obj.type) {
            if (!cloneShorts[shortIndex].is_liked) {
              cloneShorts[shortIndex].likes += 1;
              cloneShorts[shortIndex].is_liked += 1;
            } else {
              cloneShorts[shortIndex].likes -= 1;
              cloneShorts[shortIndex].is_liked -= 1;
            }
          } else if (shortReaction.share == obj.type) {
            cloneShorts[shortIndex].shares += 1;
          }
          setShortList(cloneShorts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const removeReaction = (obj: any) => {
    delShortRectn(obj)
      .then(({ data }) => {
        let cloneShorts = [...shortList];
        let shortIndex = cloneShorts.findIndex((ii) => ii.id === obj.short_id);
        if (shortIndex > -1) {
          if (shortReaction.like == obj.type) {
            cloneShorts[shortIndex].likes -= 1;
            cloneShorts[shortIndex].is_liked -= 1;
          }
          setShortList(cloneShorts);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  useEffect(() => {
    $(".video-js").each(function (videoIndex) {
      var videoId = $(this).attr("id");
      // @ts-ignore
      videojs(videoId).ready(function () {
        this.on("play", function (e) {
          //pause other video
          $(".video-js").each(function (index) {
            if (videoIndex !== index) {
              // @ts-ignore
              this.player.pause();
            }
          });
        });
        this.on("volumechange", (event) => {
          if (this.muted() || this.volume() === 0) {
            $(".video-js").each(function (index) {
              if (videoIndex !== index) {
                // @ts-ignore
                this.player.muted(true);
              }
            });
            dispatch(
              setShortOptions({
                isMuted: true,
              })
            );
          } else {
            dispatch(
              setShortOptions({
                isMuted: false,
              })
            );
            $(".video-js").each(function (index) {
              if (videoIndex !== index) {
                // @ts-ignore
                this.player.muted(false);
              }
            });
          }
        });
      });
    });
  });
  return (
    <div
      className={classNames(
        "d-flex justify-content-center align-items-center",
        styles.customContainer
      )}
    >
      <div
        id="scroll"
        ref={contentRef}
        onScroll={onReachEnd}
        className={styles.mainShortContainer}
      >
        {!shortList.length && loading ? (
          <ShortLoader />
        ) : shortList.length ? (
          <>
            {shortList.map((item: any, indx: number) => {
              return (
                <ShortCard
                  key={`short-${indx}`}
                  shortIndex={indx + 1}
                  removeAction={removeReaction}
                  addReaction={handleAddReaction}
                  shortItem={item}
                />
              );
            })}

            {loading ?? <ShortLoader />}
          </>
        ) : (
          <NotContents msg="Oops! No Short Found yet." />
        )}
      </div>
    </div>
  );
};

export default React.memo(Shorts);
