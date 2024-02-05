import BoxLoader from "shared/loader/box";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";

interface ProfileCardProps {
  isSelf: boolean;
  guest: boolean;
}

const ProfileCardLoader = ({ isSelf, guest }: Partial<ProfileCardProps>) => {
  return (
    <div
      className={classNames(
        styles.profileContainer,
        styles.customContainer,
        "d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center px-2 px-md-4"
      )}
    >
      <div
        className={classNames(
          "d-flex justify-content-start  align-items-center",
          styles.subContainer1
        )}
      >
        <div
          className={classNames(
            "d-flex justify-content-center align-items-center"
          )}
        >
          <div className={classNames(styles.profilePhotoContainer)}>
            <BoxLoader iconStyle={classNames(styles.profilePhoto)} />
          </div>
        </div>
        <div
          className={classNames(
            "ms-3 d-flex flex-column justify-content-start align-items-start"
          )}
        >
          <BoxLoader iconStyle={classNames(styles.profileTitle)} />
          <BoxLoader iconStyle={classNames(styles.profileUsername, "mt-2")} />

          <BoxLoader
            iconStyle={classNames(styles.profileStatsContainer, "mt-2")}
          />
        </div>
      </div>
      {guest ? null : (
        <div
          className={classNames(
            "d-flex justify-content-between justify-content-md-end  align-items-center mt-2 mt-md-0",
            styles.subContainer2
          )}
        >
          {isSelf ? (
            <>
              <BoxLoader iconStyle={classNames(styles.donationIconContainer)} />
              <BoxLoader
                iconStyle={classNames(styles.editBtnContainer, "ms-2")}
              />
            </>
          ) : (
            <>
              <BoxLoader iconStyle={classNames(styles.subscribeBtnContainer)} />
              <BoxLoader
                iconStyle={classNames(styles.activeFollowIconContainer, "ms-2")}
              />
              <BoxLoader
                iconStyle={classNames(
                  styles.donationIconContainer,
                  "ms-0 ms-md-2"
                )}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCardLoader;
