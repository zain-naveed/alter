import { LikeIcon, ShareIcon } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Canvas from "shared/components/canvas";
import Heading from "shared/components/heading";
import LiveCommentSection from "shared/components/liveCommentSection";
import { toastMessage } from "shared/components/toast";
import { useCallbackPrompt } from "shared/hooks/useCallbackPrompt";
import EndStreamAlert from "shared/modal/endStream";
import { resetStream } from "shared/redux/reducers/streamSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { socket, streamSocket } from "shared/services/socketService";
import { roundNum } from "shared/utils/helper";
import styles from "./style.module.scss";

const StreamDashBoard = () => {
  const { stream, user } = useSelector((state: any) => state.root);
  const navigate = useNavigate();
  const [addEvent, setAddEvent] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(addEvent);
  const dispatch = useDispatch();
  const screenStream = useRef<any>(null);
  const cameraStream = useRef<any>(null);
  const mediaRecorder = useRef<any>(0);
  const [refs] = useState<any>({
    cameraStream: cameraStream,
    screenStream: screenStream,
    mediaRecorder: mediaRecorder,
  });
  useEffect(() => {
    if (stream?.streamTitle === "") {
      toastMessage(
        "Error",
        "Please fill out streaming details before continuing"
      );
      navigate(routeConstant?.startSream.path);
      setAddEvent(false);
    } else {
      if (stream?.isStarted) {
        setAddEvent(true);
        window.addEventListener("unload", handleEndStream);
        return () => {
          window.removeEventListener("unload", handleEndStream);
        };
      } else {
        setAddEvent(false);
      }
    }
  }, [stream?.isStarted]);
  const handleEndStream = async () => {
    if (mediaRecorder.current) {
      socket.emit("end-stream", stream?.liveResp);
      streamSocket.emit("end-stream", stream?.liveResp);
      dispatch(resetStream());
      mediaRecorder.current.stop();
      mediaRecorder.current = null;
      navigate(routeConstant.profile.path.replace(":id", user?.user?.id));
      console.log("StreamingStopped");
    }
  };

  useEffect(() => {
    return () => {
      try {
        cameraStream?.current?.getTracks()[0].stop();
        cameraStream?.current?.getTracks()[1].stop();
        screenStream?.current?.getTracks()[0].stop();
        screenStream?.current?.getTracks()[1].stop();
      } catch (err) {
        console.log("ERR", err);
      }
    };
  }, []);

  const handleSocketLike = (data: any) => {
    setLikes(data?.like);
  };
  const handleSocketShare = (data: any) => {
    setShares(data?.share);
  };

  useEffect(() => {
    if (socket.id) {
      socket.on("like", handleSocketLike);
      socket.on("share", handleSocketShare);
      return () => {
        socket.removeListener("like", handleSocketLike);
        socket.removeListener("share", handleSocketShare);
      };
    }
  }, [socket.id]);

  useEffect(() => {
    if (socket.id) {
      if (String(stream?.streamid)) {
        socket.emit("join_room", { stream_id: String(stream?.streamid) });
      }
    }
  }, [String(stream?.streamid), socket.id]);

  const handleEndSocket = (data: any) => {
    console.log("Active Stream List", data);
    let found = data?.filter((itm: any, inx: any) => {
      return String(itm) === String(stream?.streamid);
    });
    if (!found?.length) {
      if (mediaRecorder.current) {
        streamSocket.emit("end-stream", stream?.liveResp);
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
        console.log("StreamingStopped");
      }
      dispatch(resetStream());
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      toastMessage(
        "error",
        "Stream ended due to prolong network disconnection"
      );
    }
  };

  useEffect(() => {
    if (socket.id) {
      if (String(stream?.streamid)) {
        socket.on("active_stream_id_list", handleEndSocket);
      }
      return () => {
        if (String(stream?.streamid)) {
          socket.removeListener("active_stream_id_list", handleEndSocket);
        }
      };
    }
  }, [String(stream?.streamid), socket.id]);

  return (
    <>
      <div
        className={classNames(
          styles.customContainer,
          "d-flex w-100 p-md-5 p-3 flex-column flex-xxl-row justify-content-xxl-between justify-content-center align-items-xxl-start align-items-center",
          styles.mainContainer
        )}
      >
        <div className={classNames(styles.videoContainer, "p-0")}>
          <Canvas ref={refs} />
          {stream?.isStarted && (
            <div
              className={classNames(
                "mt-3 mt-md-5  d-flex justify-content-start align-items-center"
              )}
            >
              <div className={classNames("d-flex align-items-center")}>
                <LikeIcon className={classNames(styles.iconStyle)} />
                <label className={classNames(styles.labelStyle, "ms-2")}>
                  {roundNum(String(likes), 1)} Likes
                </label>
              </div>
              <div className={classNames("d-flex align-items-center ms-3")}>
                <ShareIcon className={classNames(styles.iconStyle)} />
                <label className={classNames(styles.labelStyle, "ms-2")}>
                  {roundNum(String(shares), 1)} Shares
                </label>
              </div>
            </div>
          )}

          <div
            className={classNames(
              "mb-3 mb-md-4",
              stream?.isStarted ? "mt-2 mt-md-3" : "mt-3 mt-md-5"
            )}
          >
            <Heading
              title={stream?.streamTitle}
              headingStyle={styles.headingStyle}
            />
          </div>
          <div className={classNames(styles.description, "")}>
            {stream?.description}
          </div>
        </div>
        {stream?.isStarted && !stream?.disableComment && (
          <div className={classNames(styles.commentsSection, "mt-4 mt-xxl-0")}>
            <LiveCommentSection
              commentListContainer={styles.commentListContainer}
              id={String(stream?.streamid)}
              streamUserId={user?.user?.id}
              isSubscriber={false}
            />
          </div>
        )}
      </div>
      <EndStreamAlert
        show={showPrompt}
        handleClose={cancelNavigation}
        handleAction={confirmNavigation}
        handleEnd={handleEndStream}
      />
    </>
  );
};

export default StreamDashBoard;
