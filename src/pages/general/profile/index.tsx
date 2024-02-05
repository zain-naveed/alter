import { LiveIcon, profileCoverPlaceholder } from "assets";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import CustomButton from "shared/components/customButton";
import CustomTab from "shared/components/customTab";
import ProfileCard from "shared/components/profileCard";
import ProfileCardLoader from "shared/components/profileCardLoader";
import { toastMessage } from "shared/components/toast";
import BoxLoader from "shared/loader/box";
import { setFollowings } from "shared/redux/reducers/followingSlice";
import { setUser } from "shared/redux/reducers/userSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { cancelSubscription } from "shared/services/packageService";
import CancelSubscription from "shared/modal/cancelSubscription";
import {
  FollowUser,
  GetPublicUserProfile,
  GetUserProfile,
  UnFollowUser,
} from "shared/services/userService";
import { classNames } from "shared/utils/helper";
import About from "./about";
import { guestTabs, privateTabs, publicTabs, tabEnum } from "./constant";
import ProfilePrice from "./profilePrice";
import ShortList from "./shortsList";
import StreamList from "./streamsList";
import styles from "./style.module.scss";

const Profile = () => {
  const contentRef = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, followings, liveUsers } = useSelector(
    (state: any) => state.root
  );
  const [profileData, setProfileData] = useState<any>({});
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoader, setFollowLoader] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [liveStreamDetail, setLiveStreamDetail] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [infiniteScroll, setinfiniteScroll] = useState<boolean>(false);
  const [showUnSubscribeModal, setShowUnSubscribeModal] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(
    (location?.state as any)?.selectType
      ? (location?.state as any)?.selectType
      : "Recent Streams"
  );
  const [reloadSubsc, setReloadSubscptn] = useState<boolean>(false);
  const [unsubLoad, setUnSubscibeLoad] = useState<boolean>(false);
  const handleFollowing = () => {
    setFollowLoader(true);
    if (!isFollowing) {
      let formData = new FormData();
      formData.append("user_id", String(id));
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
        })
        .finally(() => {
          setFollowLoader(false);
        });
    } else {
      let formData = new FormData();
      formData.append("user_id", String(id));
      UnFollowUser(formData)
        .then((res) => {
          let cloneFollowing = followings?.followings.filter(
            (itm: any, inx: any) => {
              return itm?.id != id;
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
        })
        .finally(() => {
          setFollowLoader(false);
        });
    }
  };
  const handleActiveTab = (val: string) => {
    setActiveTab(val);
  };

  const renderCover: any = () => {
    if (isStreaming) {
      return liveStreamDetail?.thumbnail_base_url + liveStreamDetail?.thumbnail;
    } else {
      if (String(user?.user?.id) === id) {
        if (user?.user?.cover_photo) {
          return user?.user?.base_url + user?.user?.cover_photo;
        } else {
          return profileCoverPlaceholder;
        }
      } else if (profileData?.cover_photo) {
        return profileData?.base_url + profileData?.cover_photo;
      } else {
        return profileCoverPlaceholder;
      }
    }
  };

  const getProfileData = () => {
    if (String(user?.user?.id) === id) {
      GetUserProfile()
        .then((res) => {
          if (res?.data?.status) {
            let userObj = {
              ...res?.data?.data?.user,
              token: user?.user?.token,
            };
            let resp = {
              user: userObj,
              isLoggedIn: true,
            };
            dispatch(setUser(resp));
          } else {
            toastMessage("Error", res?.data?.message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      GetPublicUserProfile(id)
        .then((res) => {
          if (res?.data?.status) {
            if (res?.data?.data?.user) {
              if (res?.data?.data?.user?.user_name === "guest_user") {
                navigate(routeConstant.feed.path);
              } else {
                setProfileData(res?.data?.data?.user);
                setIsFollowing(res?.data?.data?.user?.isFollowing);
              }
            } else {
              navigate(routeConstant.default.path);
            }
          } else {
            navigate(routeConstant.default.path);
            toastMessage("Error", res?.data?.message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleLiveStream = () => {
    let isLiveStream = liveUsers?.users?.filter((item: any) => {
      return String(item?.user_id) === id;
    });
    if (isLiveStream?.length > 0) {
      setIsStreaming(true);
      setLiveStreamDetail(isLiveStream[0]);
    } else {
      setIsStreaming(false);
      setLiveStreamDetail(null);
    }
  };
  const handleUnSubscribeModalClose = () => {
    setShowUnSubscribeModal(false);
  };

  useEffect(() => {
    setIsStreaming(false);
    setLiveStreamDetail(null);
    setLoading(true);
    setActiveTab(
      (location?.state as any)?.selectType
        ? (location?.state as any)?.selectType
        : "Recent Streams"
    );

    getProfileData();
  }, [id, reloadSubsc]);

  useEffect(() => {
    handleLiveStream();
  }, [id, liveUsers?.users, reloadSubsc]);

  const handleUnSubscribeModalOpen = () => {
    setShowUnSubscribeModal(true);
  };
  const navigateToSubscribe = () => {
    if (user?.id != id && profileData?.transaction_id) {
      handleUnSubscribeModalOpen();
    } else {
      setActiveTab(tabEnum.PricingPlans);
    }
  };
  const handleCancelSubscrption = () => {
    let obj = {
      subscription_id: profileData?.transaction_id,
    };
    setUnSubscibeLoad(true);
    cancelSubscription(obj)
      .then(({ data: { data, message } }) => {
        if (data?.is_cancel) {
          toastMessage(
            "success",
            "Package Subscription Cancelled Successfully!"
          );
          handleUnSubscribeModalClose();
          reloadPage();
        } else {
          toastMessage("error", message);
        }
      })
      .finally(() => setUnSubscibeLoad(false));
  };
  const reloadPage = () => {
    setReloadSubscptn(!reloadSubsc);
  };
  const onReachEnd = () => {
    let checkHeight = (contentRef.current as any)?.scrollHeight;
    let onReachEnd =
      (contentRef.current as any)?.scrollTop +
      (contentRef.current as any)?.clientHeight;

    if (onReachEnd == checkHeight) {
      setinfiniteScroll(true);
    }
  };
  useEffect(() => {
    let doc: any = window.document.getElementById("mainContainer");
    let nested: any = window.document.getElementById("scroll");

    if (doc) {
      doc.style.overflowY = "visible";
      nested.style.overflowY = "scroll";
      nested.style.overflowX = "hidden";
      nested.style.height = "calc(100vh - 81px)";
      nested.style.minHeight = "auto";
    }
  });
  return (
    <div
      id="scroll"
      ref={contentRef}
      onScroll={onReachEnd}
      className={classNames(styles.profileContainer)}
    >
      <div className={classNames(styles.coverContainer)}>
        {loading ? (
          <BoxLoader iconStyle={classNames(styles.coverStyle)} />
        ) : (
          <img
            src={renderCover()}
            className={classNames(styles.coverStyle)}
            alt="cover-pic"
          />
        )}
        {isStreaming && (
          <div className={classNames(styles.coverContentContainer)}>
            <div
              className={classNames(
                "position-relative d-flex align-items-center justify-content-center",
                styles.customContainer
              )}
            >
              <div className={classNames(styles.coverContentSubContainer)}>
                <div className={classNames(styles.liveContainer)}>
                  <LiveIcon className={classNames(styles.liveIcon)} />
                  <label className={classNames(styles.liveLabel, "ms-1")}>
                    Live
                  </label>
                </div>
                <label className={classNames(styles.liveStreamTitle)}>
                  {liveStreamDetail?.stream_title}
                </label>
                <CustomButton
                  title="Watch Now"
                  containerStyle={classNames(styles.watchBtn)}
                  submitHandle={() => {
                    navigate(
                      routeConstant?.streamDetail?.path.replace(
                        ":id",
                        liveStreamDetail?.stream_id
                      )
                    );
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <ProfileCardLoader
            isSelf={id === String(user?.user?.id)}
            guest={user?.guest}
          />
        ) : (
          <ProfileCard
            user={id === String(user?.user?.id) ? user?.user : profileData}
            isFollowing={isFollowing}
            handleFollowing={handleFollowing}
            isSelf={id === String(user?.user?.id)}
            followLoader={followLoader}
            navigateToSubscribe={navigateToSubscribe}
            guest={user?.guest}
          />
        )}
      </div>
      <div
        className={classNames(
          "d-flex flex-row justify-content-center justify-content-sm-start align-items-center mt-5",
          styles.customContainer,
          styles.tabsWrapper
        )}
      >
        <CustomTab
          isFull={false}
          tabs={
            user?.guest
              ? guestTabs
              : id === String(user?.user?.id)
              ? privateTabs
              : publicTabs
          }
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
          noBottomBorder
          isProfileTabs
        />
      </div>

      <div className="d-flex flex-row justify-content-center align-items-center">
        <div
          className={classNames(
            styles.contentContainer,
            styles.customContainer
          )}
        >
          {tabEnum.RecentStreams === activeTab ? (
            <StreamList
              streamList={
                id === String(user?.user?.id)
                  ? user?.user?.streams
                  : profileData?.streams
              }
              infiniteScroll={infiniteScroll}
              setinfiniteScroll={setinfiniteScroll}
              userId={id}
              isSelf={id === String(user?.user?.id)}
            />
          ) : tabEnum.Shorts === activeTab ? (
            <ShortList
              infiniteScroll={infiniteScroll}
              setinfiniteScroll={setinfiniteScroll}
              userId={id}
              isSelf={id === String(user?.user?.id)}
            />
          ) : tabEnum.PricingPlans === activeTab ||
            tabEnum.myPlan === activeTab ? (
            <div
              className={classNames(
                "my-2 d-flex flex-column w-100 px-4 px-sm-0"
              )}
            >
              <ProfilePrice
                id={id}
                activeTab={activeTab}
                reloadPage={reloadPage}
              />
            </div>
          ) : (
            <About
              user={id === String(user?.user?.id) ? user?.user : profileData}
              id={id}
            />
          )}
        </div>
      </div>
      <CancelSubscription
        show={showUnSubscribeModal}
        handleClose={handleUnSubscribeModalClose}
        handleSubmit={handleCancelSubscrption}
        loader={unsubLoad}
      />
    </div>
  );
};

export default Profile;
