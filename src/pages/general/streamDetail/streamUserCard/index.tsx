import {
  defaultAvatar,
  DonationIcon,
  UserAddIcon,
  UserRemoveIcon,
} from "assets";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import { toastMessage } from "shared/components/toast";
import BoxLoader from "shared/loader/box";
import DonateModal from "shared/modal/donate";
import { setFollowings } from "shared/redux/reducers/followingSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { FollowUser, UnFollowUser } from "shared/services/userService";
import { classNames, roundNum } from "shared/utils/helper";
import styles from "./style.module.scss";

const StreamUserCard = ({
  streamUser,
  loading,
  base_url,
  hasSubscribed,
  isFollowingStatus,
  Followee,
  Follower,
  Videos,
  isDonation,
  handleUnSubscribeModalOpen,
  handlePaymentModalOpen,
  isLive,
  streamId,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { followings, user } = useSelector((state: any) => state.root);
  const [isFollowing, setIsFollowing] = useState<boolean>(isFollowingStatus);
  const [openDonateModal, setOpenDonateModal] = useState<boolean>(false);
  const handleModalOpen = () => {
    if (isDonation) {
      setOpenDonateModal(true);
    } else {
      toastMessage("error", "This user is currently not accepting donations.");
    }
  };
  const handleModalClose = () => {
    setOpenDonateModal(false);
  };
  const [followLoader, setFollowLoader] = useState<boolean>(false);

  const handleFollowing = () => {
    setFollowLoader(true);
    if (!isFollowing) {
      let formData = new FormData();
      formData.append("user_id", String(streamUser?.id));
      FollowUser(formData)
        .then(({ data: { data, message } }) => {
          if (data?.status) {
            let cloneArr = [...followings?.followings];
            cloneArr.push(data?.followee);
            dispatch(
              setFollowings({
                followings: cloneArr,
                base_url: followings?.base_url,
              })
            );
            setIsFollowing(true);
            toastMessage("success", message);
          } else {
            toastMessage("Error", message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          setFollowLoader(false);
        });
    } else {
      let formData = new FormData();
      formData.append("user_id", String(streamUser?.id));
      UnFollowUser(formData)
        .then((res) => {
          setIsFollowing(false);
          let cloneFollowing = followings?.followings.filter(
            (itm: any, inx: any) => {
              return itm?.id != streamUser?.id;
            }
          );
          dispatch(
            setFollowings({
              followings: cloneFollowing,
              base_url: followings?.base_url,
            })
          );
          toastMessage("success", res?.data?.message);
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          setFollowLoader(false);
        });
    }
  };

  const navigateToProfile = () => {
    navigate(routeConstant?.profile.path.replace(":id", streamUser?.id));
  };

  useEffect(() => {
    setIsFollowing(isFollowingStatus);
  }, [isFollowingStatus]);

  return (
    <div
      className={classNames("d-flex row m-0 p-0 py-5 flex-column flex-xxl-row")}
    >
      <div className={classNames("col-xxl-8 col-12 p-0 d-flex")}>
        {loading ? (
          <BoxLoader iconStyle={classNames(styles.photoContainerLoader)} />
        ) : (
          <div
            className={classNames(styles.photoContainer)}
            role="button"
            onClick={navigateToProfile}
          >
            <img
              src={
                streamUser?.avatar
                  ? streamUser?.social_login_id
                    ? streamUser?.avatar
                    : base_url + streamUser?.avatar
                  : defaultAvatar
              }
              alt="profile-pic"
              className={classNames(styles.photoStyle)}
            />
          </div>
        )}

        <div className={classNames("d-flex flex-column ms-1 ms-md-3  ")}>
          {loading ? (
            <>
              <BoxLoader
                iconStyle={classNames(styles.usertitleLoader, "mt-2")}
              />
              <BoxLoader iconStyle={classNames(styles.userTagLoader, "mt-1")} />
              <BoxLoader
                iconStyle={classNames(styles.statsContainerLoader, "mt-2")}
              />
              <BoxLoader
                iconStyle={classNames(styles.userBioLoader1, "mt-2")}
              />
              <BoxLoader
                iconStyle={classNames(styles.userBioLoader2, "mt-1")}
              />
            </>
          ) : (
            <>
              <label
                className={classNames(styles.usertitle)}
                role="button"
                onClick={navigateToProfile}
              >
                {streamUser?.first_name + " " + streamUser?.last_name}
              </label>
              <label
                className={classNames(styles.userTag)}
                role="button"
                onClick={navigateToProfile}
              >
                @{streamUser?.user_name}
              </label>
              <div
                className={classNames(
                  "d-flex justify-content-between align-items-center mt-1 flex-wrap",
                  styles.statsContainer
                )}
              >
                <label className={classNames(styles.statsLabel)}>
                  {roundNum(Follower, 1)} followers
                </label>
                <label className={classNames(styles.statsLabel)}>
                  {roundNum(Followee, 1)} following
                </label>
                <label className={classNames(styles.statsLabel)}>
                  {roundNum(Videos, 1)} videos
                </label>
              </div>
              <label className={classNames(styles.userBio, "mt-2")}>
                {streamUser?.bio}
              </label>
            </>
          )}
        </div>
      </div>
      {user?.guest ? null : (
        <div
          className={classNames(
            "col-xxl-4 col-12 d-flex justify-content-md-end justify-content-center align-items-center mt-xxl-0 mt-3 p-0 "
          )}
        >
          {loading ? (
            <>
              <BoxLoader iconStyle={classNames(styles.subscribeBtnContainer)} />
              <BoxLoader
                iconStyle={classNames(styles.activeFollowIconContainer, "ms-2")}
              />
              <BoxLoader
                iconStyle={classNames(styles.donationIconContainer, "ms-2")}
              />
            </>
          ) : (
            <>
              <CustomButton
                title={hasSubscribed ? "UnSubscribe" : "Subscribe"}
                containerStyle={classNames(styles.subscribeBtnContainer)}
                submitHandle={
                  hasSubscribed
                    ? () => handleUnSubscribeModalOpen()
                    : () => handlePaymentModalOpen()
                }
              />

              <CustomButton
                Icon={!isFollowing ? UserAddIcon : UserRemoveIcon}
                containerStyle={classNames(
                  !isFollowing
                    ? styles.activeFollowIconContainer
                    : styles.inActiveFollowIconContainer,
                  "ms-2"
                )}
                loading={followLoader}
                isDisable={followLoader}
                submitHandle={handleFollowing}
                iconStyle={styles.profileIcons}
              />
              <CustomButton
                Icon={DonationIcon}
                containerStyle={classNames(
                  styles.donationIconContainer,
                  "ms-2"
                )}
                iconStyle={styles.profileIcons}
                submitHandle={handleModalOpen}
              />
            </>
          )}
        </div>
      )}

      {/* need to send user for donation */}
      <DonateModal
        streamId={streamId}
        isLive={isLive}
        otherUser={streamUser}
        show={openDonateModal}
        handleClose={handleModalClose}
        isSubscriber={hasSubscribed}
      />
    </div>
  );
};

export default StreamUserCard;
