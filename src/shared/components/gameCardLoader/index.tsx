import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

interface GameCardProps {
  isStream: boolean;
  isInProfile: boolean;
  isSelf: boolean;
}

const GameCardLoader = (item: GameCardProps) => {
  return (
    <div className={classNames(styles.gameCardTopContainer)}>
      <div
        className={classNames(
          item?.isInProfile ? styles.lightGreyBorder : styles.gameCardContainer
        )}
        style={
          item?.isInProfile
            ? { minHeight: "305px" }
            : item?.isStream
            ? { minHeight: "366px" }
            : { minHeight: "320px" }
        }
      >
        <div className="position-relative">
          <BoxLoader iconStyle={classNames(styles.imgStyle)} />
        </div>

        <div className={`pt-4 px-4`}>
          <BoxLoader iconStyle={classNames(styles.titleLabel1)} />
          <BoxLoader iconStyle={classNames(styles.titleLabel2, "mt-2")} />
          {!item?.isInProfile && (
            <div className={`d-flex py-4 m-0`}>
              <div className=" p-0 d-flex justify-content-start">
                <BoxLoader iconStyle={classNames(styles.userIconStyle)} />
              </div>
              <div
                className={` d-flex flex-column  ms-2 p-0 w-100 ${
                  item?.isStream
                    ? "justify-content-start"
                    : "justify-content-center"
                } align-items-start `}
              >
                <BoxLoader iconStyle={classNames(styles.usertitle)} />
                {item?.isStream && (
                  <BoxLoader iconStyle={classNames(styles.username, "mt-1")} />
                )}
              </div>
            </div>
          )}
        </div>
        {item?.isStream && !item?.isInProfile && (
          <div
            className={`d-flex justify-content-between align-items-center ${styles.cardbtmContainer} p-3`}
          >
            <BoxLoader iconStyle={classNames(styles.activeContainer)} />

            <BoxLoader iconStyle={classNames(styles.btmText)} />
          </div>
        )}
        {item?.isInProfile && (
          <div
            className={`d-flex justify-content-between align-items-center px-4 py-3`}
          >
            <BoxLoader iconStyle={classNames(styles.btmText)} />
            <BoxLoader iconStyle={classNames(styles.btmText)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCardLoader;
