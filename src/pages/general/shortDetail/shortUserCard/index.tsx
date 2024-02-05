import {
  defaultAvatar,
  DonationIcon,
  UserAddIcon,
  UserRemoveIcon,
} from "assets";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/customButton";
import BoxLoader from "shared/loader/box";
import DonateModal from "shared/modal/donate";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { toastMessage } from "shared/components/toast";
import { FollowUser, UnFollowUser } from "shared/services/userService";
import { useDispatch, useSelector } from "react-redux";
import { setFollowings } from "shared/redux/reducers/followingSlice";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import LoginAlert from "shared/modal/loginAlert";
interface ShortDetailsProps {
  loading: boolean;
  userId: string;
  shortUser: any;
  profileURL: string;
  title: string;
  description: string;
  shortFollowing: boolean;
  shortId: any;
}

const ShortUserCard = ({
  loading,
  shortUser,
  profileURL,
  title,
  description,
  shortFollowing,
  shortId,
}: ShortDetailsProps) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { followings, user } = useSelector((state: any) => state.root);
  const [openDonateModal, setOpenDonateModal] = useState<boolean>(false);
  const [followLoader, setFollowLoader] = useState<boolean>(false);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);
  const handleLoginAlertOpen = () => {
    setShowLoginAlert(true);
  };
  const handleLoginAlertClose = () => {
    setShowLoginAlert(false);
  };
  const handleModalOpen = () => {
    if (shortUser?.is_donation_enable) {
      setOpenDonateModal(true);
    } else {
      toastMessage("error", "This user is currently not accepting donations.");
    }
  };
  const handleModalClose = () => {
    setOpenDonateModal(false);
  };

  const handleFollowing = () => {
    setFollowLoader(true);
    if (!isFollowing) {
      let formData = new FormData();
      formData.append("user_id", String(shortUser?.id));
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
      formData.append("user_id", String(shortUser?.id));
      UnFollowUser(formData)
        .then((res) => {
          let cloneFollowing = followings?.followings.filter(
            (itm: any, inx: any) => {
              return itm?.id != shortUser?.id;
            }
          );
          dispatch(
            setFollowings({
              followings: cloneFollowing,
              base_url: followings?.base_url,
            })
          );
          setIsFollowing(false);
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

  const navigateToUser = () => {
    if (user?.user?.token) {
      navigate(routeConstant.profile.path.replace(":id", "") + shortUser?.id);
    } else {
      handleLoginAlertOpen();
    }
  };

  useEffect(() => {
    setIsFollowing(shortFollowing);
  }, [shortFollowing]);

  return (
    <div
      className={classNames(
        "d-flex row m-0  pt-4 flex-column flex-lg-row col-11"
      )}
    >
      <div className={classNames("col-lg-8 col-12 p-0 d-flex")}>
        {loading ? (
          <BoxLoader iconStyle={classNames(styles.photoLoader)} />
        ) : (
          <div
            role={"button"}
            className={classNames(styles.photoContainer)}
            onClick={() => {
              navigateToUser();
            }}
          >
            <img
              src={
                shortUser?.avatar
                  ? shortUser?.social_login_id
                    ? shortUser?.avatar
                    : profileURL + shortUser?.avatar
                  : defaultAvatar
              }
              alt="profile-pic"
              className={classNames(styles.photoStyle)}
            />
          </div>
        )}

        <div className={classNames("d-flex flex-column ms-1 ms-md-3 w-100 ")}>
          {loading ? (
            <>
              <BoxLoader iconStyle={classNames(styles.userTitleLoader)} />
              <BoxLoader
                iconStyle={classNames(styles.shortsTitleLoader, "mt-2")}
              />
              <BoxLoader
                iconStyle={classNames(styles.shortsdescLoader1, "mt-sm-3 mt-2")}
              />
              <BoxLoader
                iconStyle={classNames(styles.shortsdescLoader2, "mt-1")}
              />
            </>
          ) : (
            <>
              <label
                role={"button"}
                onClick={() => navigateToUser()}
                className={classNames(styles.usertitle)}
              >
                {shortUser?.first_name} {shortUser?.last_name}
              </label>
              <label className={classNames(styles.shortTitle)}>{title}</label>
              <label className={classNames(styles.shortDesc, "mt-2")}>
                {description}
              </label>
            </>
          )}
        </div>
      </div>
      {user?.user?.token && !user?.guest ? (
        <div
          className={classNames(
            "col-lg-4 col-12 d-flex justify-content-md-end justify-content-center align-items-center mt-xxl-0 mt-3 p-0 "
          )}
        >
          {loading ? (
            <>
              <BoxLoader
                iconStyle={classNames(styles.activeFollowIconContainer)}
              />
              <BoxLoader
                iconStyle={classNames(styles.activeFollowIconContainer, "ms-2")}
              />
            </>
          ) : shortUser?.id != user?.user?.id ? (
            <>
              <CustomButton
                Icon={!isFollowing ? UserAddIcon : UserRemoveIcon}
                containerStyle={classNames(
                  !isFollowing
                    ? styles.activeFollowIconContainer
                    : styles.inActiveFollowIconContainer,
                  "ms-2"
                )}
                submitHandle={handleFollowing}
                iconStyle={classNames(styles.profileIcons, "me-2")}
                title={!isFollowing ? "Follow" : "Remove"}
                loading={followLoader}
                isDisable={followLoader}
                spinnerColor={isFollowing ? "#6c5dd3" : "white"}
              />
              <CustomButton
                Icon={DonationIcon}
                containerStyle={classNames(
                  styles.donationIconContainer,
                  "ms-2"
                )}
                iconStyle={classNames(styles.profileIcons, "me-2")}
                title="Donate"
                submitHandle={handleModalOpen}
              />
            </>
          ) : null}
        </div>
      ) : (
        ""
      )}

      {openDonateModal ? (
        <DonateModal
          otherUser={shortUser}
          show={openDonateModal}
          handleClose={handleModalClose}
          isShort={true}
          shortId={shortId}
        />
      ) : (
        ""
      )}
      <LoginAlert show={showLoginAlert} handleClose={handleLoginAlertClose} />
    </div>
  );
};

export default ShortUserCard;
