import { forwardRef, useEffect, useRef, useState } from "react";
import { clearTimeout, setTimeout } from "worker-timers";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.scss";
import classNames from "classnames";
import CustomButton from "../customButton";
import { CameraOff, CameraOn, MicMute, MicOn } from "assets";
import { setStream } from "shared/redux/reducers/streamSlice";
import { StreamBaseURL, WebSocketURL } from "shared/utils/endpoints";
import { startStream } from "shared/services/streamService";
import { toastMessage } from "../toast";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import { socket, streamSocket } from "shared/services/socketService";
import { browserName } from "react-device-detect";
const Canvas = forwardRef((props: any, ref: any) => {
  const [mimeType, setMimeType] = useState<string>("");
  const [streamingSupported, setStreamingSupported] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, stream } = useSelector((state: any) => state.root);
  const { cameraStream, screenStream, mediaRecorder } = ref;
  const dispatch = useDispatch();
  const canvasRef = useRef<any>(null);
  const mainVideo = useRef<any>(null);
  const medallionVideo = useRef<any>(null);
  const canvasStream = useRef<any>(null);
  const audioStream = useRef<any>(null);
  const audioContextRef = useRef<any>(null);
  const screenAudioSuorceRef = useRef<any>(null);
  const isScreenShareRef = useRef<any>(0);
  const isCameraRef = useRef<any>(0);
  const webSocketRef = useRef<any>(null);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isCamera, setIsCamera] = useState<boolean>(false);
  const [isMic, setIsMic] = useState<boolean>(true);
  const [starting, setStarting] = useState<boolean>(false);
  const streamSocketDetail = useRef<any>(null);
  const [isStreamPossible, setIsStreamPossible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const initializeVideo = () => {
    mainVideo.current = document.createElement("video");
    medallionVideo.current = document.createElement("video");
    medallionVideo.current.muted = true;
    mainVideo.current.muted = true;
    canvasRef.current = document.createElement("canvas");
  };

  const startCamera = async () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 1920,
          height: 1080,
          aspectRatio: {
            exact: 1920 / 1080,
          },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })
      .then((stream) => {
        setIsStreamPossible(true);
        cameraStream.current = stream;
        mixMicrophoneAudio();
        medallionVideo.current.srcObject = cameraStream.current;
        medallionVideo.current.play();
        setIsCamera(true);
        isCameraRef.current = 1;
      })
      .catch((err) => {
        setIsStreamPossible(false);
        if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
          toastMessage("Error", "Device Not Found!");
          setErrorMessage("Device Not Found!");
        } else if (
          err.name == "NotReadableError" ||
          err.name == "TrackStartError"
        ) {
          toastMessage("Error", "Webcam or Mic is already in use!");
          setErrorMessage("Webcam or Mic is already in use!");
        } else if (
          err.name == "OverconstrainedError" ||
          err.name == "ConstraintNotSatisfiedError"
        ) {
          toastMessage(
            "Error",
            "Constraints can not be satisfied by avb. devices!"
          );
          setErrorMessage("Constraints can not be satisfied by avb. devices!");
          //
        } else if (
          err.name == "NotAllowedError" ||
          err.name == "PermissionDeniedError"
        ) {
          toastMessage("Error", "Permission denied in browser!");
          setErrorMessage("Permission denied in browser!");
        } else {
          console.log("Err", err);
        }
      });
  };

  const startScreenShare = async () => {
    if (browserName === "Safari") {
      toastMessage("error", "Screen Sharing is not supported in Safari.");
    } else {
      screenStream.current = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080,
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      mixScreenAudio();
      screenStream.current.getVideoTracks()[0].addEventListener("ended", () => {
        isScreenShareRef.current = 0;
        setIsSharingScreen(false);
        try {
          let audioSource = screenAudioSuorceRef.current;
          audioSource.disconnect();
        } catch (err) {
          console.log("ERROR", err);
        }
      });
      mainVideo.current.srcObject = screenStream.current;
      mainVideo.current.play();
      isScreenShareRef.current = 1;
      setIsSharingScreen(true);
    }
  };

  const stopScreenShare = async () => {
    screenStream.current.getTracks().forEach((track: any) => track.stop());
    try {
      let audioSource = screenAudioSuorceRef.current;
      audioSource.disconnect();
    } catch (err) {
      console.log("ERROR", err);
    }
    isScreenShareRef.current = 0;
    setIsSharingScreen(false);
  };

  const cameraToggle = async () => {
    setIsCamera(!isCamera);
    isCameraRef.current = !isCameraRef.current;
    cameraStream.current
      .getVideoTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
  };

  const micToggle = () => {
    setIsMic(!isMic);
    cameraStream.current
      .getAudioTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
  };

  const mixMicrophoneAudio = () => {
    let audioContext: any = getAudioContext();
    audioContextRef.current = audioContext;
    let gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0; // don't hear self
    let audioSource = audioContext.createMediaStreamSource(
      cameraStream.current
    );
    audioSource.connect(gainNode);
    let audioDestination = audioContext.createMediaStreamDestination();
    audioSource.connect(audioDestination);
    audioStream.current = audioDestination;
  };

  const mixScreenAudio = () => {
    try {
      let audioSource = audioContextRef.current.createMediaStreamSource(
        screenStream.current
      );
      screenAudioSuorceRef.current = audioSource;
      audioSource.connect(audioStream.current);
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  function getAudioContext() {
    if (typeof AudioContext !== "undefined") {
      return new AudioContext();
    }
  }

  const paintOnCanvas = () => {
    const canvasElement = canvasRef.current;
    const FPS = 30;
    const ctx = canvasElement.getContext("2d");
    let myTimeout: any;
    const draw = () => {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      if (isScreenShareRef.current === 1) {
        canvasElement.height = mainVideo.current.videoHeight;
        canvasElement.width = mainVideo.current.videoWidth;
        clearTimeout(myTimeout);
        ctx.drawImage(mainVideo.current, 0, 0);

        if (isScreenShareRef.current && isCameraRef.current) {
          let top =
            mainVideo.current.videoHeight -
            medallionVideo.current.videoHeight * 0.26;

          ctx.drawImage(
            medallionVideo.current,
            0,
            0,
            medallionVideo.current.videoWidth,
            medallionVideo.current.videoHeight,
            0,
            top,
            medallionVideo.current.videoWidth -
              medallionVideo.current.videoWidth * 0.75,
            medallionVideo.current.videoHeight -
              medallionVideo.current.videoHeight * 0.75
          );
        }
      } else {
        clearTimeout(myTimeout);
        canvasElement.height = medallionVideo.current.videoHeight;
        canvasElement.width = medallionVideo.current.videoWidth;
        ctx.drawImage(medallionVideo.current, 0, 0);
      }

      myTimeout = setTimeout(draw, 1000 / FPS);
    };
    myTimeout = setTimeout(draw, 1000 / FPS);
    canvasStream.current = canvasRef.current.captureStream(30);
    let vid: any = document.querySelector("#stream");
    vid.srcObject = canvasStream.current;
    vid.play();
  };

  const startStreaming = async () => {
    if (streamingSupported && isStreamPossible) {
      setStarting(true);
      let strmKey =
        user?.user?.first_name.replace(/\s/g, "") + new Date().getTime();
      streamSocket.emit("start-stream", {
        stream_id: strmKey,
      });
      let formData = new FormData();
      formData.append("description", stream?.description);
      formData.append("title", stream?.streamTitle);
      formData.append("thumbnail", stream?.thumbnail);
      formData.append("video_url", `${StreamBaseURL}${strmKey}/index.m3u8`);
      formData.append("can_comment", stream?.disableComment ? "0" : "1");
      startStream(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            let resp = {
              user_id: data?.stream?.user_id,
              stream_id: String(data?.stream?.stream_id),
              thumbnail_base_url: data?.stream?.thumbnail_base_url,
              thumbnail: data?.stream?.thumbnail,
              stream_title: data?.stream?.stream_title,
            };
            setTimeout(() => {
              setStarting(false);
              setIsStreaming(true);
              dispatch(
                setStream({
                  ...stream,
                  isStarted: true,
                  streamid: data?.stream?.stream_id,
                  liveResp: resp,
                })
              );
              streamSocketDetail.current = resp;
              socket.emit("rejoin-start-stream", resp);
            }, 10000);

            socket.emit("start-stream", resp);

            canvasStream.current.addTrack(
              audioStream.current?.stream?.getTracks()[0]
            );
            mediaRecorder.current = new MediaRecorder(canvasStream.current, {
              mimeType: mimeType,
              videoBitsPerSecond: 3 * 1024 * 1024,
            });

            mediaRecorder.current.ondataavailable = async (e: any) => {
              streamSocket.emit("data", {
                stream: e.data,
                stream_id: strmKey,
              });
              socket.emit("receive-file", {
                stream: e.data,
                stream_id: data?.stream?.stream_id,
              });
            };

            mediaRecorder.current.onstop = () => {
              console.log("Recorder Stopped");
            };

            mediaRecorder.current.start(250);
            console.log("StreamingStarted");
          } else {
            toastMessage("Error", message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
          setStarting(false);
        });
    } else {
      toastMessage("Error", errorMessage);
    }
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    dispatch(setStream({ ...stream, isStarted: false, liveResp: null }));
    socket.emit("end-stream", streamSocketDetail.current);
    streamSocket.emit("end-stream", streamSocketDetail.current);
    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext("2d");
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    mediaRecorder.current.stop();
    mediaRecorder.current = null;
    if (isScreenShareRef.current === 1) {
      stopScreenShare();
    }
    setTimeout(() => {
      navigate(routeConstant.profile.path.replace(":id", user?.user?.id));
    }, 500);

    console.log("StreamingStopped");
  };

  useEffect(() => {
    initializeVideo();
    if (stream?.streamTitle !== "") {
      if (browserName === "Chrome") {
        if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
          setStreamingSupported(true);
          setMimeType("video/webm;codecs=h264");
        } else {
          setErrorMessage(
            "Streaming is not Supported in currently installed version of Chrome please Update to latest version"
          );
          setStreamingSupported(false);
        }
      } else if (browserName === "Safari") {
        if (MediaRecorder.isTypeSupported("video/mp4;codecs:h264")) {
          setStreamingSupported(true);
          setErrorMessage(
            "Streaming is not Supported in currently installed version of Safari please Update to latest version"
          );
          setMimeType("video/mp4;codecs:h264");
        } else {
          setStreamingSupported(false);
        }
      } else if (browserName === "Edge") {
        if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
          setStreamingSupported(true);
          setMimeType("video/webm;codecs=h264");
          setErrorMessage(
            "Streaming is not Supported in currently installed version of Edge please Update to latest version"
          );
        } else {
          setStreamingSupported(false);
        }
      } else {
        setStreamingSupported(false);
        setErrorMessage(
          "Streaming is only Supported on Chrome, Safari and Edge"
        );
      }

      startCamera();
      paintOnCanvas();
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={classNames(styles.videoStreamContainer)}>
        <video
          id="stream"
          className={classNames(styles.videoStream)}
          autoPlay
          muted
          controls={false}
        />
      </div>
      <div
        className={classNames("d-flex justify-content-between my-3 my-md-4")}
      >
        <CustomButton
          title={
            isSharingScreen ? "Stop Screen Sharing" : "Start Screen Sharing"
          }
          submitHandle={isSharingScreen ? stopScreenShare : startScreenShare}
          containerStyle={styles.scrnShrBtn}
        />
        <CustomButton
          containerStyle={styles.iconBtn}
          submitHandle={micToggle}
          Icon={isMic ? MicOn : MicMute}
          iconStyle={styles.iconStyle}
        />
        <CustomButton
          containerStyle={styles.iconBtn}
          submitHandle={cameraToggle}
          Icon={isCamera ? CameraOn : CameraOff}
          iconStyle={styles.iconStyle}
        />
        <CustomButton
          title={isStreaming ? "Stop Streaming" : "Start Streaming"}
          submitHandle={isStreaming ? stopStreaming : startStreaming}
          containerStyle={styles.strtStrmBtn}
          isDisable={starting}
          loading={starting}
        />
      </div>
    </>
  );
});

export default Canvas;
