import {
  CommentIcon,
  defaultAvatar,
  LikeIcon,
  ShareIcon,
  ViewsIcon,
} from "assets";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import VideoJS from "shared/components/shortsCardPlayer";
import ShareModal from "shared/modal/share";
import videojs from "video.js";
import styles from "./style.module.scss";
import { useInView } from "react-intersection-observer";
import { shortNavigation, shortReaction } from "shared/utils/constants";
import { toastMessage } from "../toast";
import { routeConstant } from "shared/routes/routeConstant";
import { useSelector } from "react-redux";
import LoginAlert from "shared/modal/loginAlert";

interface ShortProps {
  src: string;
  title: string;
  description: string;
  user: {
    firstname: string;
    lastname: string;
    avatar: string;
    id: string;
  };
  likes: [];
  comments: [];
  shares: [];
  shortItem: any;
  addReaction: any;
  removeAction: any;
  shortIndex: number;
}

const ShortCard = (item: Partial<ShortProps>) => {
  const { shortItem, addReaction, shortIndex } = item;
  const navigate = useNavigate();
  const playerRef = useRef<any>(null);
  const { short, user } = useSelector((state: any) => state.root);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);

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

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: shortItem?.video_url
          ? shortItem?.video_base_url + shortItem?.video_url
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
    muted: short?.isMuted,
    loop: true,
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

  const { ref, entry } = useInView({
    trackVisibility: true,
    delay: 100,
    threshold: 0.7,
  });

  useEffect(() => {
    if (entry && entry.intersectionRatio > 0.6) {
      if (playerRef?.current) {
        playerRef?.current.play();
        let obj = {
          short_id: shortItem?.id,
          type: shortReaction.views,
        };
        addReaction(obj);
      }
    } else {
      if (playerRef?.current) {
        playerRef?.current.pause();
      }
    }
  }, [entry?.intersectionRatio]);
  const handleShare = () => {
    setShareOpen(false);
    let obj = {
      short_id: shortItem?.id,
      type: shortReaction.share,
    };
    addReaction(obj);
    // window.location.href
    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.host +
        routeConstant.shareShortDetail.path.replace(":id", "") +
        shortItem?.id
    );
    toastMessage("success", "Link is Copied Successfully!");
  };

  const navigateToShort = () => {
    if (shortItem?.id) {
      navigate(
        routeConstant.shortDetail.path.replace(":id", "") + shortItem?.id,
        {
          state: {
            navigate: shortNavigation.short,
            userId: shortItem?.user?.id,
            num: shortIndex,
            shortFilter: "All",
            isInitial: true,
          },
        }
      );
    }
  };

  return (
    <div className={`m-2`}>
      <div className="d-flex flex-sm-row flex-column p-0 m-0 align-items-center justify-content-between px-4 pt-3">
        <div className={classNames("w-100")} ref={ref}>
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
        <div
          className={classNames(
            "d-flex flex-row flex-sm-column justify-content-end align-self-end align-items-center ms-0 ms-sm-4 mb-1 mt-3 mt-sm-0"
          )}
        >
          <div className="d-flex flex-column align-items-center me-3 me-sm-0  mb-0  mb-sm-2 mb-md-3">
            <CustomButton
              Icon={ViewsIcon}
              containerStyle={styles.inActivebtnStyle}
              iconStyle={styles.btnIconStyle}
            />
            <label className={`${styles.btnCount} mt-1`}>
              {shortItem?.views}
            </label>
          </div>
          <div className="d-flex flex-column align-items-center me-3 me-sm-0   mb-0  mb-sm-2 mb-md-3">
            <CustomButton
              Icon={LikeIcon}
              containerStyle={
                shortItem?.is_liked ? styles.btnStyle : styles.inActivebtnStyle
              }
              iconStyle={styles.btnIconStyle}
              submitHandle={() => {
                if (user?.guest) {
                  handleLoginAlertOpen();
                } else {
                  if (!shortItem?.is_liked) {
                    let obj = {
                      short_id: shortItem?.id,
                      type: shortReaction.like,
                    };
                    addReaction(obj);
                  } else if (shortItem?.is_liked) {
                    let obj = {
                      short_id: shortItem?.id,
                      type: shortReaction.like,
                    };
                    addReaction(obj);
                  }
                }
              }}
            />
            <label className={`${styles.btnCount} mt-1`}>
              {shortItem?.likes}
            </label>
          </div>
          <div className="d-flex flex-column align-items-center me-3 me-sm-0   mb-0  mb-sm-2 mb-md-3">
            <CustomButton
              Icon={CommentIcon}
              containerStyle={styles.inActivebtnStyle}
              iconStyle={styles.btnIconStyle}
              submitHandle={() => navigateToShort()}
            />
            <label className={`${styles.btnCount} mt-1`}>
              {shortItem?.comments}
            </label>
          </div>
          <div className="d-flex flex-column align-items-center">
            <CustomButton
              Icon={ShareIcon}
              containerStyle={styles.inActivebtnStyle}
              iconStyle={styles.btnIconStyle}
              submitHandle={handleShareOpen}
            />
            <label className={`${styles.btnCount} mt-1`}>
              {shortItem?.shares}
            </label>
          </div>
        </div>
      </div>
      <div className="row p-0 mb-3 px-4">
        <div className="col-12 col-sm-11 px-md-3 px-1 pt-sm-3 pt-1 d-flex align-items-start justify-content-start">
          <div className="col-1 d-flex justify-content-center">
            <div
              className={`position-relative ${styles.userIconContainer} `}
              onClick={() =>
                navigate(
                  routeConstant.profile.path.replace(":id", "") +
                    shortItem?.user?.id
                )
              }
              role="button"
            >
              <img
                src={
                  shortItem?.user?.avatar
                    ? shortItem?.profile_image_base_url +
                      shortItem?.user?.avatar
                    : defaultAvatar
                }
                className={styles.userIcon}
                alt="profile-pic"
              />
            </div>
          </div>

          <div className="d-flex flex-column justify-content-center align-items-start col-11">
            <label
              className={`${styles.userTitle} col-12`}
              onClick={() =>
                navigate(
                  routeConstant.profile.path.replace(":id", "") +
                    shortItem?.user?.id
                )
              }
              role="button"
            >
              {shortItem?.user?.first_name + " " + shortItem?.user?.last_name}
              {/* {shortItem?.user?.user_name} */}
            </label>
            <label className={`${styles.streamTitle} mt-0 mt-md-1 col-12`}>
              {shortItem?.title}
            </label>
            <label className={`${styles.streamDesc} mt-0 mt-md-2 col-12`}>
              {shortItem?.description}
            </label>
          </div>
        </div>
      </div>
      <div
        className={`${styles.shortContainer} ms-lg-3 ms-md-2 ms-sm-1 ms-0`}
      />
      <ShareModal
        show={shareOpen}
        id={shortItem?.id}
        handleClose={handleShareClose}
        handleSubmit={handleShare}
        isStream={false}
      />
      <LoginAlert show={showLoginAlert} handleClose={handleLoginAlertClose} />
    </div>
  );
};

export default React.memo(ShortCard);
