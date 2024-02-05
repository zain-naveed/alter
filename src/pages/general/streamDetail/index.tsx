import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import CommentSection from "shared/components/commentSection";
import LiveCommentSection from "shared/components/liveCommentSection";
import VideoJS from "shared/components/streamVideoPlayer";
import { toastMessage } from "shared/components/toast";
import TrendingStreamer from "shared/components/trendingStreamers";
import BoxLoader from "shared/loader/box";
import ShareModal from "shared/modal/share";
import { routeConstant } from "shared/routes/routeConstant";
import { socket } from "shared/services/socketService";
import {
  addStreamRectn,
  getStreamDetails,
} from "shared/services/streamService";
import { streamReaction } from "shared/utils/constants";
import {
  classNames,
  fullScreenInnerHTMLText,
  mediumScreenInnerHTMLText,
  padTo2Digits,
} from "shared/utils/helper";
import CancelSubscription from "shared/modal/cancelSubscription";
import videojs from "video.js";
import StreamInfoCard from "./streamInfoCard";
import StreamUserCard from "./streamUserCard";
import styles from "./style.module.scss";
import { cancelSubscription } from "shared/services/packageService";
import "./stream.css";
import AddCardModal from "shared/modal/AddCard";
import PaymentSuccessModal from "shared/modal/paymentSuccess";
import SelectCardModal from "shared/modal/selectCard";
import PaymentPlansModal from "shared/modal/paymentPlans";
import { LoginUser } from "shared/services/authService";
import { setUser } from "shared/redux/reducers/userSlice";
import { setRouteReducer } from "shared/redux/reducers/routeSlice";
import LoginAlert from "shared/modal/loginAlert";
function StreamDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playerRef = useRef<any>(null);
  const { user } = useSelector((state: any) => state.root);
  const { id } = useParams();
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [streamDetail, setStreamDetail] = useState<any>(null);
  const [isSubscriber, setIsSubscriber] = useState<boolean>(false);
  const [streamUser, setStreamUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<any>(0);
  const isFullScreen = useRef<any>(0);
  const isContinue = useRef<any>(0);
  const socketCount = useRef<any>(0);
  const [watching, setWatching] = useState<any>(0);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<any>(null);
  const [showCardSelectModal, setShowCardSelectModal] =
    useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [selectPlan, setSelectPlan] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showUnSubscribeModal, setShowUnSubscribeModal] =
    useState<boolean>(false);
  const [unsubLoad, setUnSubscibeLoad] = useState<boolean>(false);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    aspectRatio: "16:9",
    controlBar: {
      children: [
        "playToggle",
        "volumePanel",
        "progressControl",
        "fullscreenToggle",
      ],
    },

    preload: true,
  };

  const handleLoginAlertOpen = () => {
    setShowLoginAlert(true);
  };
  const handleLoginAlertClose = () => {
    setShowLoginAlert(false);
  };

  const handleShareOpen = () => {
    setShareOpen(true);
  };
  const handleShareClose = () => {
    setShareOpen(false);
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    if (streamDetail?.is_live) {
      if (playerRef.current) {
        playerRef.current?.src({
          src: `${streamDetail?.video_url}`,
          type: "application/x-mpegURL",
        });
      }
    } else {
      if (playerRef.current) {
        playerRef.current?.src({
          src: `${streamDetail?.video_base_url}${streamDetail?.video_url}`,
          type: "video/mp4",
        });
      }
    }

    if (!streamDetail?.is_live) {
      if (isContinue?.current === 1) {
        player?.currentTime(Math.ceil(Number(streamDetail?.watched)));
      } else {
        player?.currentTime(0);
      }
    }

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });

    const parentNodes = document.getElementsByClassName("video-js");
    const childNode = document.createElement("div");
    childNode.setAttribute("class", "vjs-title-bar");
    childNode.setAttribute("id", "custom-title-bar");
    childNode.innerHTML = mediumScreenInnerHTMLText(
      streamDetail,
      watching,
      timeGenerator(seconds)
    );
    if (parentNodes[0]) parentNodes[0].appendChild(childNode);

    player.on("fullscreenchange", () => {
      if (player.isFullscreen()) {
        isFullScreen.current = 1;
        childNode.innerHTML = fullScreenInnerHTMLText(
          streamDetail,
          watching,
          timeGenerator(seconds)
        );
      } else {
        isFullScreen.current = 0;
        childNode.innerHTML = mediumScreenInnerHTMLText(
          streamDetail,
          watching,
          timeGenerator(seconds)
        );
      }
    });

    player.on("ended", function (event: any) {
      if (!streamDetail?.is_live) {
        socket.emit("watch-video", {
          watchable_id: Number(streamDetail?.id),
          user_id: user?.user?.id,
          watched_time: player?.currentTime(),
        });
      }
    });
  };

  const handleStreamDetails = async () => {
    if (user?.user?.token) {
      getStreamDetails(id)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            if (data?.stream) {
              setStreamDetail(data?.stream);
              setStreamUser(data?.stream?.user);
              setIsLike(data?.stream?.is_liked);
              setIsSubscriber(data?.stream?.transaction_id ? true : false);
              let obj = {
                stream_id: id,
                type: streamReaction.views,
              };
              handleAddReaction(obj);
            } else {
              toastMessage("Error", "Stream does not exist!");
              navigate(routeConstant?.default.path);
            }
          } else {
            toastMessage("Error", message);
            navigate(routeConstant?.default.path);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          navigate(routeConstant?.default.path);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      await guestLogin();
      getStreamDetails(id)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            if (data?.stream) {
              setStreamDetail(data?.stream);
              setStreamUser(data?.stream?.user);
              setIsLike(data?.stream?.is_liked);
              setIsSubscriber(data?.stream?.transaction_id ? true : false);
              let obj = {
                stream_id: id,
                type: streamReaction.views,
              };
              handleAddReaction(obj);
            } else {
              toastMessage("Error", "Stream does not exist!");
              navigate(routeConstant?.default.path);
            }
          } else {
            toastMessage("Error", message);
            navigate(routeConstant?.default.path);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          navigate(routeConstant?.default.path);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddReaction = (obj: any) => {
    addStreamRectn(obj)
      .then(({ data }) => {
        let cloneStreamDetail = { ...streamDetail };
        if (cloneStreamDetail?.id) {
          if (streamReaction.views === obj.type) {
            if (!cloneStreamDetail?.is_viewed) {
              cloneStreamDetail.views += 1;
            }
          } else if (streamReaction.like === obj.type) {
            if (!cloneStreamDetail.is_liked) {
              cloneStreamDetail.likes += 1;
              cloneStreamDetail.is_liked += 1;
              setIsLike(true);
            } else {
              cloneStreamDetail.likes -= 1;
              cloneStreamDetail.is_liked -= 1;
              setIsLike(false);
            }
          } else if (streamReaction.share === obj.type) {
            cloneStreamDetail.shares += 1;
          }
          setStreamDetail(cloneStreamDetail);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleShare = () => {
    setShareOpen(false);
    if (streamDetail?.is_live) {
      let obj = {
        reactionable_id: id,
        user_id: user?.user?.id,
      };
      socket.emit("share", obj);
    } else {
      let obj = {
        stream_id: id,
        type: streamReaction.share,
      };
      handleAddReaction(obj);
    }
    navigator.clipboard.writeText(window.location.href);
    toastMessage("success", "Link is Copied!");
  };

  const handleLike = () => {
    if (user?.guest) {
      handleLoginAlertOpen();
    } else {
      if (streamDetail?.is_live) {
        let obj = {
          reactionable_id: id,
          user_id: user?.user?.id,
        };
        socket.emit("like", obj);
        setIsLike(!isLike);
      } else {
        let obj = {
          stream_id: id,
          type: streamReaction.like,
        };
        handleAddReaction(obj);
      }
    }
  };

  const handleCancelSubscrption = () => {
    let obj = {
      subscription_id: streamDetail?.transaction_id,
    };
    setUnSubscibeLoad(true);
    cancelSubscription(obj)
      .then(({ data: { data, message } }) => {
        if (data?.is_cancel) {
          let cloneStreamDetail = { ...streamDetail };
          if (cloneStreamDetail?.id) {
            cloneStreamDetail.transaction_id = "";
            setStreamDetail(cloneStreamDetail);
          }
          setIsSubscriber(false);
          toastMessage(
            "success",
            "Package Subscription Cancelled Successfully!"
          );
          handleUnSubscribeModalClose();
        } else {
          toastMessage("error", message);
        }
      })
      .finally(() => setUnSubscibeLoad(false));
  };
  const handleUnSubscribeModalClose = () => {
    setShowUnSubscribeModal(false);
  };
  const handleUnSubscribeModalOpen = () => {
    setShowUnSubscribeModal(true);
  };

  const handleViews = (data: any) => {
    setWatching(data);
  };
  const handleEndStreamSocket = (data: any) => {
    if (data) {
      if (socketCount.current == 0) {
        toastMessage("success", "Live Stream Ended");
        socketCount.current = 1;
      }
      navigate(routeConstant.feed.path);
    }
  };

  const handlePaymentModalOpen = () => {
    setShowPaymentModal(true);
    setSelectUser({ id: streamDetail?.user?.id });
  };
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };
  const handleCardSelectModalOpen = () => {
    setShowCardSelectModal(true);
  };
  const handleCardSelectModalClose = () => {
    setShowCardSelectModal(false);
  };
  const handleAddCardModalOpen = () => {
    setShowAddCardModal(true);
  };
  const handleAddCardModalClose = () => {
    setShowAddCardModal(false);
  };
  const handlePaymentSuccessModalOpen = () => {
    setShowSuccessModal(true);
    setIsSubscriber(true);
  };
  const handlePaymentSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const guestLogin = async () => {
    let formData = new FormData();
    formData.append("email", "guest_user");
    formData.append("password", "guest_user");

    await LoginUser(formData)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          let resp = {
            isLoggedIn: true,
            user: data?.user,
            guest: true,
          };
          dispatch(setUser(resp));
          dispatch(setRouteReducer({ routeType: "guest", originScreen: "/" }));
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
      });
  };

  useEffect(() => {
    setLoading(true);
    handleStreamDetails();
  }, []);

  useEffect(() => {
    if (socket.id) {
      socket.emit("join_room", { stream_id: String(id) });
      socket.emit("view-increase", { stream_id: String(id) });
      socket.on("views", handleViews);
      socket.on("endstream", handleEndStreamSocket);
      socket.on("disconnect", () => {
        socket.emit("leave_room", { stream_id: String(id) });
        socket.removeListener("endstream", handleEndStreamSocket);
        socket.removeListener("views", handleViews);
      });
    }
    return () => {
      socket.emit("leave_room", { stream_id: String(id) });
      socket.removeListener("endstream", handleEndStreamSocket);
    };
  }, [socket.id]);

  useEffect(() => {
    if (playerRef.current) {
      let node: any = document.getElementById("custom-title-bar");
      if (isFullScreen.current === 1) {
        if (node) {
          node.innerHTML = fullScreenInnerHTMLText(
            streamDetail,
            watching,
            timeGenerator(seconds)
          );
        }
      } else {
        if (node) {
          node.innerHTML = mediumScreenInnerHTMLText(
            streamDetail,
            watching,
            timeGenerator(seconds)
          );
        }
      }
    }
  }, [seconds, streamDetail, watching, playerRef?.current]);

  const timeGenerator = (seconds: any) => {
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    hours = hours % 24;
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`;
  };

  useEffect(() => {
    if (streamDetail?.created_at) {
      var t: any = new Date(streamDetail?.created_at);
      var newT: any = new Date();
      var diffTime: any = Math.abs(newT - t);
      let seconds = Math.floor(diffTime / 1000);
      setSeconds(seconds);

      setInterval(function () {
        setSeconds((pre: any) => pre + 1);
      }, 1000); // update about every second
    }
  }, [streamDetail?.created_at]);

  useEffect(() => {
    if (!streamDetail?.is_live) {
      return () => {
        if (streamDetail) {
          try {
            if (!streamDetail?.is_live) {
              if (playerRef.current) {
                socket.emit("watch-video", {
                  watchable_id: Number(streamDetail?.id),
                  user_id: user?.user?.id,
                  watched_time: playerRef?.current?.currentTime(),
                });
              }
            }
          } catch (err) {
            console.log("ERR", err);
          }
        }
      };
    }
  }, [socket, streamDetail?.id]);

  useEffect(() => {
    if (!streamDetail?.is_live) {
      let arr = streamDetail?.length?.split(":");
      let hr = "";
      let min = "";
      let sec = "";
      if (arr?.length === 2) {
        min = arr[0];
        sec = arr[1];
      } else if (arr?.length === 3) {
        hr = arr[0];
        min = arr[1];
        sec = arr[2];
      }

      let totalSecs = Number(hr) * 3600 + Number(min) * 60 + Number(sec);
      if (Math.ceil(Number(streamDetail?.watched)) < totalSecs) {
        isContinue.current = 1;
      } else {
        isContinue.current = 0;
      }
    }
  }, [streamDetail?.id]);
  return (
    <div
      className={classNames(styles.customContainer, "p-5")}
      id="topStreamDetailContainer"
    >
      <div className={classNames(styles.streamContainer)}>
        {loading ? (
          <BoxLoader iconStyle={classNames("w-100", styles.videoBoxLoader)} />
        ) : (
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        )}

        <div className={classNames("px-md-4 px-3")}>
          <StreamInfoCard
            title={streamDetail?.title}
            description={streamDetail?.description}
            isLive={streamDetail?.is_live}
            handleShareOpen={handleShareOpen}
            handleLike={handleLike}
            loading={loading}
            isSelf={streamDetail?.user?.id === user?.user?.id}
            streamDetail={streamDetail}
            isLike={isLike}
          />
          {streamDetail?.user?.id !== user?.user?.id ? (
            <StreamUserCard
              streamId={streamDetail?.id}
              isLive={streamDetail?.is_live}
              loading={loading}
              streamUser={streamUser}
              base_url={streamDetail?.profile_image_base_url}
              hasSubscribed={isSubscriber}
              isFollowingStatus={streamDetail?.isFollowing}
              Followee={streamDetail?.followees_count}
              Follower={streamDetail?.followers_count}
              Videos={streamDetail?.total_videos_count}
              isDonation={streamDetail?.is_donation_enable}
              handleUnSubscribeModalOpen={handleUnSubscribeModalOpen}
              handlePaymentModalOpen={handlePaymentModalOpen}
            />
          ) : null}
        </div>
      </div>
      {streamDetail?.can_comment ? (
        <div
          className={classNames(
            "mt-5 d-flex flex-column flex-xl-row justify-content-between align-items-start"
          )}
        >
          <div
            className={classNames(styles.comment_container)}
            id="commentContainer2"
          >
            {streamDetail?.is_live ? (
              <LiveCommentSection
                streamUserId={streamUser?.id}
                id={id}
                isSubscriber={isSubscriber}
              />
            ) : (
              <CommentSection
                isStream={true}
                userId={streamUser?.id}
                isSubscriber={isSubscriber}
              />
            )}
          </div>
          {streamDetail?.is_live ? (
            <div
              className={classNames(
                styles.trendingContainer,
                "ms-xl-4 ms-0 mt-5 mt-xl-0"
              )}
            >
              <TrendingStreamer />
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={classNames(
            "mt-5 d-flex flex-column flex-xl-row justify-content-between align-items-start"
          )}
        >
          {streamDetail?.is_live ? (
            <div className={classNames(styles.trendingContainer, "w-100")}>
              <TrendingStreamer />
            </div>
          ) : null}
        </div>
      )}
      {showPaymentModal ? (
        <PaymentPlansModal
          show={showPaymentModal}
          setSelectPlan={setSelectPlan}
          selectPlan={selectPlan}
          user={selectUser}
          handleClose={handlePaymentModalClose}
          handleCardSelect={handleCardSelectModalOpen}
        />
      ) : (
        ""
      )}

      {showCardSelectModal ? (
        <SelectCardModal
          show={showCardSelectModal}
          handleClose={handleCardSelectModalClose}
          handlePayment={handlePaymentModalOpen}
          handleAddCard={handleAddCardModalOpen}
          handleSuccessModalOpen={handlePaymentSuccessModalOpen}
          plan={selectPlan}
        />
      ) : (
        ""
      )}
      <PaymentSuccessModal
        handleClose={handlePaymentSuccessModalClose}
        show={showSuccessModal}
        streamId={streamDetail?.id}
      />
      {showAddCardModal ? (
        <AddCardModal
          show={showAddCardModal}
          handleClose={handleAddCardModalClose}
          handleCardSelect={handleCardSelectModalOpen}
        />
      ) : (
        ""
      )}
      <ShareModal
        show={shareOpen}
        handleClose={handleShareClose}
        isStream={true}
        handleSubmit={handleShare}
      />
      <CancelSubscription
        show={showUnSubscribeModal}
        handleClose={handleUnSubscribeModalClose}
        handleSubmit={handleCancelSubscrption}
        loader={unsubLoad}
        // handleBack={actionType === "view" ? handleDetailsModalOpen : () => {}}
      />
      <LoginAlert show={showLoginAlert} handleClose={handleLoginAlertClose} />
    </div>
  );
}

export default StreamDetail;
