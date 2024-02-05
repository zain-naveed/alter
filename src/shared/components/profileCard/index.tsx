import {
  BoradCastIcon,
  defaultAvatar,
  DonationIcon,
  EditProfileIcon,
  UserAddIcon,
  UserRemoveIcon,
} from "assets";
import { useState } from "react";
import { useNavigate } from "react-router";
import DonateModal from "shared/modal/donate";
import { routeConstant } from "shared/routes/routeConstant";
import { classNames, roundNum } from "shared/utils/helper";
import CustomButton from "../customButton";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";

interface ProfileCardProps {
  user: any;
  isFollowing: boolean;
  handleFollowing: () => void;
  isSelf: boolean;
  followLoader: boolean;
  navigateToSubscribe: () => void;
  guest: boolean;
}

const ProfileCard = ({
  user,
  isFollowing,
  handleFollowing,
  followLoader,
  isSelf,
  navigateToSubscribe,
  guest,
}: ProfileCardProps) => {
  const navigate = useNavigate();
  const [openDonateModal, setOpenDonateModal] = useState<boolean>(false);
  const handleModalOpen = () => {
    if (user?.is_donation_enable) {
      setOpenDonateModal(true);
    } else {
      toastMessage("error", "This user is currently not accepting donations.");
    }
  };
  const handleModalClose = () => {
    setOpenDonateModal(false);
  };
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
            <img
              src={
                user?.avatar
                  ? user?.social_login_id
                    ? user?.avatar
                    : user?.base_url + user?.avatar
                  : defaultAvatar
              }
              alt="profile-pic"
              className={classNames(styles.profilePhoto)}
              loading="lazy"
            />
          </div>
        </div>
        <div
          className={classNames(
            "ms-3 d-flex flex-column justify-content-start align-items-start",
            styles.overflowElipsis
          )}
        >
          <label className={classNames(styles.profileTitle)}>
            {user?.first_name} {user?.last_name}
          </label>
          <label className={classNames(styles.profileUsername)}>
            {user?.user_name ? "@" + user?.user_name.replace(/ /gi, "_") : ""}
          </label>
          <div
            className={classNames(
              "d-flex justify-content-between align-items-center pt-2",
              styles.profileStatsContainer
            )}
          >
            <label className={classNames(styles.profileCounter)}>
              {roundNum(user?.followers_count, 1)} followers
            </label>
            <label className={classNames(styles.profileCounter)}>
              {roundNum(user?.followees_count, 1)} following
            </label>
            <label className={classNames(styles.profileCounter)}>
              {roundNum(user?.total_videos_count, 1)} videos
            </label>
          </div>
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
              <CustomButton
                Icon={BoradCastIcon}
                containerStyle={classNames(styles.donationIconContainer)}
                iconStyle={styles.liveIcon}
                submitHandle={() => navigate(routeConstant?.startSream.path)}
              />
              <CustomButton
                iconStyle={classNames(styles.editIcon, "me-2")}
                Icon={EditProfileIcon}
                title="Edit Profile"
                containerStyle={classNames(styles.editBtnContainer, "ms-2")}
                submitHandle={() => navigate(routeConstant?.setting.path)}
              />
            </>
          ) : (
            <>
              <CustomButton
                title={user?.transaction_id ? "UnSubscribe" : "Subscribe"}
                containerStyle={classNames(styles.subscribeBtnContainer)}
                submitHandle={() => navigateToSubscribe()}
              />

              <CustomButton
                Icon={!isFollowing ? UserAddIcon : UserRemoveIcon}
                containerStyle={classNames(
                  !isFollowing
                    ? styles.activeFollowIconContainer
                    : styles.inActiveFollowIconContainer,
                  "ms-0 ms-md-2"
                )}
                submitHandle={handleFollowing}
                iconStyle={styles.profileIcons}
                loading={followLoader}
                isDisable={followLoader}
                spinnerColor={isFollowing ? "#6c5dd3" : "white"}
              />
              <CustomButton
                Icon={DonationIcon}
                containerStyle={classNames(
                  styles.donationIconContainer,
                  "ms-0 ms-md-2"
                )}
                iconStyle={styles.profileIcons}
                submitHandle={handleModalOpen}
              />
            </>
          )}
        </div>
      )}

      {openDonateModal ? (
        <DonateModal
          otherUser={user}
          show={openDonateModal}
          handleClose={handleModalClose}
          isProfile={true}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileCard;
