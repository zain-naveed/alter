import { CommentIcon, LikeIcon, LiveIcon, ShareIcon } from "assets";
import CustomButton from "shared/components/customButton";
import BoxLoader from "shared/loader/box";
import { classNames, roundNum } from "shared/utils/helper";
import styles from "./style.module.scss";

interface StreamInfoProps {
  title: string;
  description: string;
  isLive: boolean;
  handleShareOpen: () => void;
  loading: boolean;
  isSelf: boolean;
  streamDetail: any;
  handleLike: () => void;
  isLike: boolean;
}

const StreamInfoCard = ({
  title,
  description,
  isLive,
  handleShareOpen,
  loading,
  isSelf,
  streamDetail,
  handleLike,
  isLike,
}: Partial<StreamInfoProps>) => {
  const handleScroll = () => {
    var elem = document.getElementById(`topStreamDetailContainer`);
    var commElem = document.getElementById(`commentContainer2`);
    elem?.scrollTo({
      top: commElem?.offsetTop,
      left: commElem?.offsetLeft,
      behavior: "smooth",
    });
  };
  return (
    <div
      className={classNames(
        "d-flex row m-0 p-0 py-5 flex-column flex-xxl-row",
        styles.streamInfoContainer
      )}
    >
      <div className={classNames("col-xxl-8 col-12 px-1 d-flex flex-column")}>
        {loading ? (
          <BoxLoader iconStyle={classNames(styles.liveIconContainer)} />
        ) : isLive ? (
          <div className={classNames(styles.liveIconContainer)}>
            <LiveIcon className={classNames(styles.liveIcon)} />
            <label className={classNames(styles.liveLabel, "ms-1")}>Live</label>
          </div>
        ) : null}
        {loading ? (
          <>
            <BoxLoader
              iconStyle={classNames(styles.streamtitleLoader1, "mt-3")}
            />
            <BoxLoader
              iconStyle={classNames(styles.streamtitleLoader2, "mt-1")}
            />
            <BoxLoader
              iconStyle={classNames(styles.streamDescLoader1, "mt-2")}
            />
            <BoxLoader
              iconStyle={classNames(styles.streamDescLoader2, "mt-1")}
            />
          </>
        ) : (
          <>
            <label className={classNames(styles.streamtitle, "mt-1")}>
              {title}
            </label>
            <label className={classNames(styles.streamDesc, "mt-2")}>
              {description}
            </label>
          </>
        )}
      </div>
      <div
        className={classNames(
          "col-xxl-4 col-12 d-flex justify-content-end align-items-center px-xxl-1 px-0 mt-xxl-0 mt-3"
        )}
      >
        {loading ? (
          <>
            <BoxLoader
              iconStyle={classNames(styles.likeBtn, styles.btnStyle, "me-2")}
            />
            <BoxLoader
              iconStyle={classNames(styles.commentBtn, styles.btnStyle, "me-2")}
            />
            <BoxLoader
              iconStyle={classNames(styles.shareBtn, styles.btnStyle)}
            />
          </>
        ) : isSelf && !isLive ? (
          <>
            <div className="d-flex flex-column align-items-center  ">
              <CustomButton
                Icon={LikeIcon}
                containerStyle={
                  isLike ? styles.btnSmStyle : styles.inActivesmbtnStyle
                }
                iconStyle={styles.btnIconStyle}
                submitHandle={handleLike}
              />
              <label className={`${styles.btnCount} mt-1`}>
                {roundNum(streamDetail?.likes, 2)}
              </label>
            </div>
            <div className="d-flex flex-column align-items-center ms-3">
              <CustomButton
                Icon={CommentIcon}
                containerStyle={styles.inActivesmbtnStyle}
                iconStyle={styles.btnIconStyle}
                submitHandle={handleScroll}
              />
              <label className={`${styles.btnCount} mt-1`}>
                {roundNum(streamDetail?.comments, 2)}
              </label>
            </div>
            <div className="d-flex flex-column align-items-center ms-3">
              <CustomButton
                Icon={ShareIcon}
                containerStyle={styles.inActivesmbtnStyle}
                iconStyle={styles.btnIconStyle}
                submitHandle={handleShareOpen}
              />
              <label className={`${styles.btnCount} mt-1`}>
                {roundNum(streamDetail?.shares, 2)}
              </label>
            </div>
          </>
        ) : (
          <>
            <CustomButton
              title={isLike ? "Liked" : "Like"}
              Icon={LikeIcon}
              containerStyle={classNames(
                isLike ? styles.btnStyle : styles.inActivebtnStyle,
                styles.likeBtn,
                "me-2"
              )}
              iconStyle={classNames(styles.btnIcon, "me-sm-2 me-1")}
              submitHandle={handleLike}
            />
            <CustomButton
              title="Comment"
              Icon={CommentIcon}
              containerStyle={classNames(
                styles.inActivebtnStyle,
                styles.commentBtn,
                "me-2"
              )}
              iconStyle={classNames(styles.btnIcon, "me-sm-2 me-1")}
              submitHandle={handleScroll}
            />
            <CustomButton
              title="Share"
              Icon={ShareIcon}
              containerStyle={classNames(
                styles.inActivebtnStyle,
                styles.shareBtn
              )}
              iconStyle={classNames(styles.btnIcon, "me-sm-2 me-1")}
              submitHandle={handleShareOpen}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default StreamInfoCard;
