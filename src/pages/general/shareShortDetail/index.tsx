import { CloseIcon, CommentIcon, LikeIcon, ShareIcon, ViewsIcon } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import CommentSection from "shared/components/commentSection";
import CustomButton from "shared/components/customButton";
import VideoJS from "shared/components/shortsVideoPlayer";
import BoxLoader from "shared/loader/box";
import ShareModal from "shared/modal/share";
import { routeConstant } from "shared/routes/routeConstant";
import { addShortRectn, shortDetails } from "shared/services/shortService";
import { shortReaction } from "shared/utils/constants";
import { roundNum } from "shared/utils/helper";
import videojs from "video.js";
import { toastMessage } from "shared/components/toast";
import ShortUserCard from "../shortDetail/shortUserCard";
import styles from "./style.module.scss";
import LoginAlert from "shared/modal/loginAlert";

const ShareShortDetail = () => {
  const param = useParams();
  const {
    user: { user, guest },
  } = useSelector((state: any) => state.root);
  const location: any = useLocation();
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [shortDetail, setShortDetail] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState<any>(false);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);

  const handleLoginAlertOpen = () => {
    setShowLoginAlert(true);
  };
  const handleLoginAlertClose = () => {
    setShowLoginAlert(false);
  };

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
        type: "video/mp4",
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
    getShortDetail();
  }, []);

  const getShortDetail = () => {
    let query = "";
    if (user?.id) {
      query = `${param?.id}/${user?.id}`;
    } else {
      query = `${param?.id}`;
    }
    shortDetails(query)
      .then(
        ({
          data: {
            data: { short, isFollowThisShortUser },
          },
        }) => {
          setShortDetail(short);
          setIsFollowing(isFollowThisShortUser);
        }
      )
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setLoading(false));
  };

  const handleShare = () => {
    setShareOpen(false);
    let obj = {
      short_id: param?.id,
      type: shortReaction.share,
    };
    if (user?.token) {
      handleAddReaction(obj);
    }
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
    if (user?.token) {
      addShortRectn(obj)
        .then(({ data }) => {
          let cloneShortDetail = { ...shortDetail };

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
    } else {
      handleLoginAlertOpen();
    }
  };

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
            </div>
          </div>
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
                shortFollowing={isFollowing}
                shortId={shortDetail?.id}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classNames("px-4 py-5", styles.customContainer)}>
        <div
          className={classNames(styles.commentContainer)}
          id="commentContainer"
        >
          <CommentSection />
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

export default ShareShortDetail;
