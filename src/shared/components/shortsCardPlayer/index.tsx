import React, { useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./style.scss";

interface VideoJsProps {
  options: {
    autoplay: boolean;
    controls: boolean;
    responsive: boolean;
    fluid: boolean;
    sources: {
      src: any;
    }[];
    controlBar: {
      children: string[];
    };
    aspectRatio: string;
  };
  onReady: (player: any) => void;
}

export const VideoJS = ({ options, onReady }: Partial<VideoJsProps>) => {
  const videoRef = React.useRef<any>(null);
  const playerRef = React.useRef<any>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);
      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");

        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options?.autoplay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerRef]);

  return (
    <>
      <div
        data-vjs-player
        className="row d-flex justify-content-center align-items-start m-auto"
      >
        <div ref={videoRef} className="w-100 p-0" />
      </div>
    </>
  );
};

export default VideoJS;
