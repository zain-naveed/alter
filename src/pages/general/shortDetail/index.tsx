import {
  CloseIcon,
  CommentIcon,
  DownArrowIcon,
  LikeIcon,
  ShareIcon,
  UpArrowIcon,
  ViewsIcon,
} from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import CommentSection from "shared/components/commentSection";
import CustomButton from "shared/components/customButton";
import VideoJS from "shared/components/shortsVideoPlayer";
import BoxLoader from "shared/loader/box";
import ShareModal from "shared/modal/share";
import { routeConstant } from "shared/routes/routeConstant";
import { addShortRectn } from "shared/services/shortService";
import { feedShort } from "shared/services/feedService";
import { GetProfileShort } from "shared/services/userService";
import {
  filterOptions,
  shortNavigation,
  shortReaction,
} from "shared/utils/constants";
import { roundNum } from "shared/utils/helper";
import videojs from "video.js";
import ShortUserCard from "./shortUserCard";
import styles from "./style.module.scss";
import { toastMessage } from "shared/components/toast";
import { globalSearch } from "shared/services/searchService";
import $ from "jquery";
import { setShortOptions } from "shared/redux/reducers/shortSlice";
import LoginAlert from "shared/modal/loginAlert";

const ShortDetail = () => {
  const param = useParams();
  const {
    user: { user, guest },
    short,
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const location: any = useLocation();
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [shortDetail, setShortDetail] = useState<any>(null);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);
  const shortDetailRef = useRef<any>(null);
  const [page, setPage] = useState<number>(
    location?.state?.num ? location?.state?.num : 1
  );
  const [totalPage, setTotalPage] = useState<number>(0);
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: shortDetail?.video_url
          ? shortDetail?.video_base_url + shortDetail?.video_url
          : "",
      },
    ],
    controlBar: {
      children: [
        "CurrentTimeDisplay",
        "playToggle",
        "volumePanel",
        "progressControl",
        "fullscreenToggle",
      ],
    },
    aspectRatio: "16:9",
    loop: true,
    preload: true,
    muted: short?.isMuted,
  };

  const handleLoginAlertOpen = () => {
    setShowLoginAlert(true);
  };
  const handleLoginAlertClose = () => {
    setShowLoginAlert(false);
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const handleShareOpen = () => {
    setShareOpen(true);
  };
  const handleShareClose = () => {
    setShareOpen(false);
  };

  const handleScroll = () => {
    var elem = document.getElementById(`topShortDetailContainer`);
    var commElem = document.getElementById(`commentContainer`);
    elem?.scrollTo({
      top: commElem?.offsetTop,
      left: commElem?.offsetLeft,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    setLoading(true);

    if (
      (location?.state?.isInitial && page === location?.state?.num) ||
      !location?.state?.isInitial
    ) {
      if (shortNavigation.profile == location?.state?.navigate) {
        getProfileShort();
      } else if (shortNavigation.short == location?.state?.navigate) {
        getAllShorts();
      } else {
        getShortsforSearch();
      }
    }

    // getShortDetail()
  }, [page !== location?.state?.num ? page : location?.state?.num]);
  const getProfileShort = () => {
    let userid = location?.state?.userId;
    let query = `?page=${page}`;
    if (userid) {
      GetProfileShort(`/${userid}/${1}${query}`)
        .then(
          ({
            data: {
              data: { shorts, last_page },
            },
          }) => {
            let obj = {
              short_id: param?.id,
              type: shortReaction.views,
            };
            handleAddReaction(obj);
            navigate(
              routeConstant.shortDetail.path.replace(":id", "") + shorts[0].id,
              {
                replace: true,
                state: {
                  navigate: shortNavigation.profile,
                  userId: location?.state?.userId,
                  isInitial: false,
                },
              }
            );
            setShortDetail(shorts[0]);
            shortDetailRef.current = shorts[0];
            setTotalPage(last_page);
          }
        )
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => setLoading(false));
    }
  };
  const getAllShorts = () => {
    let userid = location?.state?.userId;
    let query = `?page=${page}`;
    if (userid) {
      let filval = filterOptions.filter(
        (ii) => ii.label == location?.state?.shortFilter
      );
      feedShort(filval[0].value, page, 1)
        .then(
          ({
            data: {
              data: { shorts, last_page },
            },
          }) => {
            let obj = {
              short_id: param?.id,
              type: shortReaction.views,
            };
            handleAddReaction(obj);

            navigate(
              routeConstant.shortDetail.path.replace(":id", "") + shorts[0].id,
              {
                replace: true,
                state: {
                  navigate: shortNavigation.short,
                  userId: shorts[0]?.user?.id,
                  shortFilter: location?.state?.shortFilter,
                  num: page,
                  isInitial: false,
                },
              }
            );
            setShortDetail(shorts[0]);
            shortDetailRef.current = shorts[0];
            setTotalPage(last_page);
          }
        )
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };
  const getShortsforSearch = () => {
    let formData = new FormData();
    if (location?.state?.search) {
      formData.append("search_text", location?.state?.search);
    }
    formData.append("type", "short");
    formData.append("pagination", String(1));
    globalSearch(page, formData)
      .then(
        ({
          data: {
            data: { list, last_page },
          },
        }) => {
          let obj = {
            short_id: param?.id,
            type: shortReaction.views,
          };
          handleAddReaction(obj);

          navigate(
            routeConstant.shortDetail.path.replace(":id", "") + list[0].id,
            {
              replace: true,
              state: {
                navigate: shortNavigation.search,
                userId: list[0]?.user?.id,
                search: location?.state?.search,
                isInitial: false,
              },
            }
          );
          setShortDetail(list[0]);
          shortDetailRef.current = list[0];
          setTotalPage(last_page);
        }
      )
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setLoading(false));
  };
  const nextShort = () => {
    if (page != totalPage) {
      setPage(page + 1);
    }
  };
  const prevShort = () => {
    if (page != 1) {
      setPage(page - 1);
    }
  };
  const handleShare = () => {
    setShareOpen(false);
    let obj = {
      short_id: param?.id,
      type: shortReaction.share,
    };
    handleAddReaction(obj);
    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.host +
        routeConstant.shareShortDetail.path.replace(":id", "") +
        param?.id
    );
    toastMessage("success", "Link is Copied Successfully!");
  };
  const handleAddReaction = (obj: any) => {
    addShortRectn(obj)
      .then(({ data }) => {
        let cloneShortDetail = { ...shortDetailRef.current };
        if (cloneShortDetail?.id) {
          if (shortReaction.views == obj.type) {
            if (!cloneShortDetail?.is_viewed) {
              cloneShortDetail.views += 1;
            }
          } else if (shortReaction.like == obj.type) {
            if (!cloneShortDetail.is_liked) {
              cloneShortDetail.likes += 1;
              cloneShortDetail.is_liked += 1;
            } else {
              cloneShortDetail.likes -= 1;
              cloneShortDetail.is_liked -= 1;
            }
          } else if (shortReaction.share == obj.type) {
            cloneShortDetail.shares += 1;
          }
          setShortDetail(cloneShortDetail);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    $(".video-js").each(function (videoIndex) {
      var videoId = $(this).attr("id");
      // @ts-ignore
      videojs(videoId).ready(function () {
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
      className={classNames(styles.topLevelContainer)}
      id="topShortDetailContainer"
    >
      <div className={classNames("", styles.shortContainer)}>
        {!loading && (
          <img
            alt="bg"
            src={shortDetail?.thumbnail_base_url + shortDetail?.cover_photo}
            className={classNames(styles.bgImg)}
          />
        )}

        <div
          className={classNames(
            styles.linearGrad,
            !loading ? styles.background_Color : "",
            "pb-5 pt-5 pt-lg-4"
          )}
        >
          <div className="d-flex d-lg-none flex-column align-items-center py-3">
            <CustomButton
              Icon={CloseIcon}
              containerStyle={styles.crossIconStyle2}
              iconStyle={styles.btnIconStyle}
              submitHandle={() => navigate(-1)}
            />
          </div>
          <div
            className={classNames(
              "row p-0 align-items-center position-relative mx-auto my-0",
              styles.shortContentContainer,
              styles.customContainer
            )}
          >
            <div className="col-lg-11 col-12  p-0 m-0">
              {loading ? (
                <BoxLoader
                  iconStyle={classNames(
                    "col-11 p-0 m-auto",
                    styles.videoBoxLoader
                  )}
                />
              ) : (
                <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
              )}
            </div>
            <div
              className={classNames(
                "col-lg-1 col-12 d-flex flex-row flex-lg-column justify-content-between align-items-center ps-4 pe-3 px-2 p-lg-0 m-0 mt-3 mt-lg-0"
              )}
            >
              <div className="d-lg-flex flex-column align-items-center d-none">
                <CustomButton
                  Icon={CloseIcon}
                  containerStyle={styles.crossIconStyle}
                  iconStyle={styles.btnIconStyle}
                  submitHandle={() => navigate(-1)}
                />
              </div>
              <div className="d-flex flex-column align-items-center mb-lg-3 mb-0 ">
                {loading ? (
                  <>
                    <BoxLoader
                      iconStyle={classNames(styles.inActivebtnStyle)}
                    />
                    <BoxLoader
                      iconStyle={classNames(styles.btnCountLoader, "mt-1")}
                    />
                  </>
                ) : (
                  <>
                    <CustomButton
                      Icon={ViewsIcon}
                      containerStyle={styles.inActivebtnStyle}
                      iconStyle={styles.btnIconStyle}
                    />
                    <label className={`${styles.btnCount} mt-1`}>
                      {roundNum(shortDetail?.views, 2)}
                    </label>
                  </>
                )}
              </div>
              <div className="d-flex flex-column align-items-center mb-lg-3 mb-0">
                {loading ? (
                  <>
                    <BoxLoader
                      iconStyle={classNames(styles.inActivebtnStyle)}
                    />
                    <BoxLoader
                      iconStyle={classNames(styles.btnCountLoader, "mt-1")}
                    />
                  </>
                ) : (
                  <>
                    <CustomButton
                      Icon={LikeIcon}
                      containerStyle={
                        shortDetail?.is_liked
                          ? styles.btnStyle
                          : styles.inActivebtnStyle
                      }
                      iconStyle={styles.btnIconStyle}
                      submitHandle={() => {
                        if (guest) {
                          handleLoginAlertOpen();
                        } else {
                          let obj = {
                            short_id: param?.id,
                            type: shortReaction.like,
                          };
                          handleAddReaction(obj);
                        }
                      }}
                    />
                    <label className={`${styles.btnCount} mt-1`}>
                      {roundNum(shortDetail?.likes, 2)}
                    </label>
                  </>
                )}
              </div>
              <div className="d-flex flex-column align-items-center  mb-lg-3 mb-0 ">
                {loading ? (
                  <>
                    <BoxLoader
                      iconStyle={classNames(styles.inActivebtnStyle)}
                    />
                    <BoxLoader
                      iconStyle={classNames(styles.btnCountLoader, "mt-1")}
                    />
                  </>
                ) : (
                  <>
                    <CustomButton
                      Icon={CommentIcon}
                      containerStyle={styles.inActivebtnStyle}
                      iconStyle={styles.btnIconStyle}
                      submitHandle={handleScroll}
                    />
                    <label className={`${styles.btnCount} mt-1`}>
                      {roundNum(shortDetail?.comments, 2)}
                    </label>
                  </>
                )}
              </div>
              <div className="d-flex flex-column align-items-center  mb-lg-4 mb-0">
                {loading ? (
                  <>
                    <BoxLoader
                      iconStyle={classNames(styles.inActivebtnStyle)}
                    />
                    <BoxLoader
                      iconStyle={classNames(styles.btnCountLoader, "mt-1")}
                    />
                  </>
                ) : (
                  <>
                    <CustomButton
                      Icon={ShareIcon}
                      containerStyle={styles.inActivebtnStyle}
                      iconStyle={styles.btnIconStyle}
                      submitHandle={handleShareOpen}
                    />
                    <label className={`${styles.btnCount} mt-1`}>
                      {roundNum(shortDetail?.shares, 2)}
                    </label>
                  </>
                )}
              </div>
              <div
                className={classNames(
                  "align-items-center justify-content-center d-flex flex-column"
                )}
              >
                <div
                  className={classNames(
                    styles.arrowContainer,
                    page <= 1 ? styles.disableArrow : ""
                  )}
                  onClick={prevShort}
                  role={"button"}
                >
                  <UpArrowIcon className={classNames(styles.btnIconStyle2)} />
                </div>
                <div
                  className={classNames(
                    styles.arrowContainer,
                    "mt-2",
                    page == totalPage ? styles.disableArrow : ""
                  )}
                  onClick={nextShort}
                  role={"button"}
                >
                  <DownArrowIcon className={classNames(styles.btnIconStyle2)} />
                </div>
              </div>
            </div>
          </div>
          {location?.state?.userId !== user?.id ? (
            <div
              className={classNames(
                "p-0 align-items-center position-relative mx-auto my-0",
                styles.customContainer
              )}
            >
              <div
                className={classNames(
                  " p-0 align-items-center justify-content-center d-flex m-0"
                )}
              >
                <ShortUserCard
                  loading={loading}
                  userId={location?.state?.userId}
                  shortUser={shortDetail?.user}
                  profileURL={shortDetail?.profile_image_base_url}
                  title={shortDetail?.title}
                  description={shortDetail?.description}
                  shortFollowing={shortDetail?.is_following}
                  shortId={shortDetail?.id}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className={classNames("px-4 py-5", styles.customContainer)}>
        <div
          className={classNames(styles.commentContainer)}
          id="commentContainer"
        >
          <CommentSection userId={shortDetail?.user?.id} />
        </div>
      </div>
      <ShareModal
        id={param?.id}
        show={shareOpen}
        handleClose={handleShareClose}
        handleSubmit={handleShare}
        isStream={false}
      />
      <LoginAlert show={showLoginAlert} handleClose={handleLoginAlertClose} />
    </div>
  );
};

export default ShortDetail;
