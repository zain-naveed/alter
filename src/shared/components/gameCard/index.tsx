import { defaultAvatar, EditIcon, LiveIcon, TrashIcon } from "assets";
import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AddCardModal from "shared/modal/AddCard";
import DeleteVideoModal from "shared/modal/deleteVideo";
import EditStream from "shared/modal/editStream";
import PaymentPlansModal from "shared/modal/paymentPlans";
import SelectCardModal from "shared/modal/selectCard";
import { routeConstant } from "shared/routes/routeConstant";
import { roundNum } from "shared/utils/helper";
import { delType, shortNavigation } from "shared/utils/constants";
import { DelProfileShort } from "shared/services/userService";
import styles from "./style.module.scss";
import { toastMessage } from "../toast";
import { useSelector } from "react-redux";
import { delStream } from "shared/services/streamService";
import PaymentSuccessModal from "shared/modal/paymentSuccess";

interface GameCardProps {
  thumbnailsrc: string;
  title: string;
  user: any;
  viewCount: string;
  isStream: boolean;
  length: string;
  isInProfile: boolean;
  created_at: any;
  isSelf: boolean;
  forceUpdate?: any;
  index: number;
  views?: string | any;
  profile_image_base_url: string;
  navigateType: string;
  DelType: string;
  is_live: any;
  shortsFilter?: string;
  description?: string;
  id: string;
  isinFeed: boolean;
  watched: any;
}

const GameCard = (item: Partial<GameCardProps>) => {
  const { search } = useSelector((state: any) => state.root);
  const [mouseIn, setMouseIn] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(item?.title ? item?.title : "");
  const [description, setDescription] = useState<string>(
    item?.description ? item?.description : ""
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<any>(null);
  const [showCardSelectModal, setShowCardSelectModal] =
    useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [delLoader, setDelLoader] = useState<boolean>(false);
  const [selectPlan, setSelectPlan] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const navigateToStream = (id: string) => {
    navigate(routeConstant.streamDetail.path.replace(":id", "") + id);
  };
  const navigateToShort = (id: string) => {
    navigate(routeConstant.shortDetail.path.replace(":id", "") + id, {
      state: {
        navigate: item?.navigateType
          ? item?.navigateType
          : shortNavigation.profile,
        userId: (item as any)?.user_id,
        num: (item as any)?.index + 1,
        search: search?.text ? search?.text : "",
        shortFilter: item?.shortsFilter ? item?.shortsFilter : "",
        isInitial: true,
      },
    });
  };
  const navigateToEditShort = () => {
    navigate(routeConstant.uploadShort.path, {
      state: {
        isEdit: true,
        file: (item as any)?.video_base_url + (item as any)?.video_url,
        thumbnail:
          (item as any)?.thumbnail_base_url + (item as any)?.cover_photo,
        title: item?.title,
        shortId: (item as any)?.id,
        description: (item as any)?.description,
      },
    });
  };
  const handleModalOpen = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleDeleteModalOpen = () => {
    setShowDeleteModal(true);
  };
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };
  const handlePaymentModalOpen = () => {
    setShowPaymentModal(true);
    setSelectUser(item?.user);
  };
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };
  const handleCardSelectModalOpen = () => {
    setShowCardSelectModal(true);
  };
  const handleCardSelectModalClose = () => {
    setShowCardSelectModal(false);
  };
  const handleAddCardModalOpen = () => {
    setShowAddCardModal(true);
  };
  const handleAddCardModalClose = () => {
    setShowAddCardModal(false);
  };
  const handlePaymentSuccessModalOpen = () => {
    setShowSuccessModal(true);
  };
  const handlePaymentSuccessModalClose = () => {
    setShowSuccessModal(false);
  };
  const deleteShort = (delId: string) => {
    setDelLoader(true);
    if (delType.short === item?.DelType) {
      delProfileShort(delId);
    } else if (delType.stream === item?.DelType) {
      delProfileStream(delId);
    }
  };
  const delProfileShort = (shortId: string) => {
    let formBody = new FormData();
    formBody.append("id", shortId);
    DelProfileShort(formBody)
      .then(({ data: { data, message } }) => {
        handleDeleteModalClose();
        toastMessage("success", message);
        item.forceUpdate();
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setDelLoader(false);
      });
  };
  const delProfileStream = (streamId: string) => {
    let formBody = new FormData();
    formBody.append("id", streamId);
    delStream(formBody)
      .then(({ data: { data, message } }) => {
        handleDeleteModalClose();
        toastMessage("success", message);
        item.forceUpdate();
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setDelLoader(false);
      });
  };

  useEffect(() => {
    let arr = item?.length?.split(":");
    let hr = "";
    let min = "";
    let sec = "";
    if (arr?.length === 2) {
      min = arr[0];
      sec = arr[1];
    } else if (arr?.length === 3) {
      hr = arr[0];
      min = arr[1];
      sec = arr[2];
    }

    let totalSecs = Number(hr) * 3600 + Number(min) * 60 + Number(sec);
    let watchTime = Number(item?.watched);
    if (watchTime >= totalSecs) {
      watchTime = totalSecs;
    }

    let percent = (100 * Number(watchTime)) / totalSecs;

    let note: any = document.querySelector(`#bar-style-${item?.id}`);
    if (note) {
      // note.style.width = `calc(${Math.ceil(percent)}% - 15px)`;
      note.style.width = `calc(${Math.ceil(percent)}%)`;
    }
  }, [item?.id]);

  return (
    <>
      <div className={classNames(styles.gameCardTopContainer)}>
        <div
          className={classNames(
            item?.isInProfile
              ? styles.lightGreyBorder
              : styles.gameCardContainer
          )}
          style={
            item?.isInProfile
              ? { minHeight: "305px" }
              : item?.isStream
              ? { minHeight: "366px" }
              : { minHeight: "320px" }
          }
          role="button"
          onMouseEnter={() => {
            setMouseIn(true);
          }}
          onMouseLeave={() => {
            setMouseIn(false);
          }}
          onClick={() => {
            item?.isStream
              ? navigateToStream((item as any)?.id)
              : navigateToShort((item as any)?.id);
          }}
        >
          <div className="position-relative">
            <img
              className={styles.imgStyle}
              src={
                (item as any)?.cover_photo
                  ? (item as any)?.thumbnail_base_url +
                    (item as any)?.cover_photo
                  : (item as any)?.thumbnail
                  ? (item as any)?.thumbnail_base_url + (item as any)?.thumbnail
                  : defaultAvatar
              }
              alt="game-card-img"
            />
            {item?.isInProfile || !item?.isStream ? (
              item?.isSelf && mouseIn ? (
                <div className={classNames(styles.actionContainer)}>
                  <div
                    className={classNames(styles.actionIconContainer)}
                    onClick={(e) => {
                      e.stopPropagation();
                      item?.isStream
                        ? handleModalOpen()
                        : navigateToEditShort();
                    }}
                  >
                    <EditIcon className={styles.actionIcon} />
                  </div>
                  <div
                    className={classNames(styles.actionIconContainer)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteModalOpen();
                    }}
                  >
                    <TrashIcon className={styles.actionIcon} />
                  </div>
                </div>
              ) : (
                <div className={`${styles.durationContainer} px-2`}>
                  <label className={`${styles.durationText}`} role="button">
                    {item?.length ? item?.length : "00:00"}
                  </label>
                </div>
              )
            ) : null}
            {item?.isStream && item?.isInProfile ? (
              <div className={`${styles.bar}`} id={`bar-style-${item?.id}`} />
            ) : null}
          </div>

          <div className={`pt-3 px-3`}>
            <label className={styles.titleLabel} role="button">
              {title}
            </label>
            {!item?.isInProfile ? (
              <div className={`d-flex col-12 row py-3 m-0`}>
                <div
                  className={classNames(
                    "col-1 p-0 d-flex justify-content-start",
                    styles.userIconStyle
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      routeConstant.profile.path.replace(":id", "") +
                        item?.user?.id
                    );
                  }}
                >
                  <img
                    src={
                      item?.user?.avatar
                        ? item?.user?.social_login_id
                          ? item?.user?.avatar
                          : item?.profile_image_base_url + item?.user?.avatar
                        : defaultAvatar
                    }
                    className={styles.userIconStyle}
                    alt="user-pic"
                  />
                </div>

                <div
                  className={`col-9 d-flex flex-column  ms-2 ${
                    item?.isStream
                      ? "justify-content-start"
                      : "justify-content-center"
                  } align-items-start `}
                >
                  <label
                    className={styles.usertitle}
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        routeConstant.profile.path.replace(":id", "") +
                          item?.user?.id
                      );
                    }}
                  >
                    {item?.user?.first_name} {item?.user?.last_name}
                  </label>
                  {item?.isStream ? (
                    <label
                      className={styles.username}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          routeConstant.profile.path.replace(":id", "") +
                            item?.user?.id
                        );
                      }}
                    >
                      @
                      {item?.user?.username
                        ? item?.user?.username
                        : item?.user?.user_name}
                    </label>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          {(item as any)?.is_live && !item?.isInProfile ? (
            <div
              className={`d-flex justify-content-between align-items-center ${styles.cardbtmContainer} p-3`}
            >
              <div className={`${styles.activeContainer} px-3`}>
                <LiveIcon />
                <label className={`${styles.livetext} ms-1`}>Live</label>
              </div>
              <div
                className={`d-flex justify-content-center align-items-center`}
              >
                <div className={styles.bluedot} />
                <label className={`${styles.btmText} ms-1`} role="button">
                  <span className="me-1">{roundNum(item?.views, 1)}</span>
                  Watching
                </label>
              </div>
            </div>
          ) : null}
          {item?.isInProfile || (item?.isinFeed && !item?.is_live) ? (
            <div
              className={`d-flex justify-content-between align-items-center px-3 py-3 ${
                item?.isinFeed && !item?.is_live ? styles.cardbtmContainer : ""
              }`}
            >
              <div
                className={classNames(
                  styles.blueTextContainer,
                  `d-flex justify-content-center align-items-center`
                )}
              >
                <div className={styles.bluedot} />
                <label className={`${styles.btmText} ms-1`} role="button">
                  {roundNum(item?.views, 1)} View{item?.views > 1 ? "s" : ""}
                </label>
              </div>
              <div
                className={classNames(
                  styles.greenTextContainer,
                  `d-flex justify-content-center align-items-center`
                )}
              >
                <div className={styles.greenDot} />
                <label className={`${styles.btmText} ms-1`} role="button">
                  {moment.utc(item?.created_at).local().fromNow()}
                </label>
              </div>
            </div>
          ) : null}
        </div>
        <EditStream
          show={showModal}
          handleClose={handleModalClose}
          title={title}
          desc={description}
          id={item?.id}
          setTitle={setTitle}
          setDescription={setDescription}
        />
        <DeleteVideoModal
          show={showDeleteModal}
          handleClose={handleDeleteModalClose}
          handleAction={() => deleteShort((item as any)?.id)}
          isStream={item?.isStream}
          loader={delLoader}
        />
        {showPaymentModal ? (
          <PaymentPlansModal
            show={showPaymentModal}
            setSelectPlan={setSelectPlan}
            selectPlan={selectPlan}
            user={selectUser}
            handleClose={handlePaymentModalClose}
            handleCardSelect={handleCardSelectModalOpen}
          />
        ) : (
          ""
        )}

        {showCardSelectModal ? (
          <SelectCardModal
            show={showCardSelectModal}
            handleClose={handleCardSelectModalClose}
            handlePayment={handlePaymentModalOpen}
            handleAddCard={handleAddCardModalOpen}
            handleSuccessModalOpen={handlePaymentSuccessModalOpen}
            plan={selectPlan}
          />
        ) : (
          ""
        )}
        <PaymentSuccessModal
          handleClose={handlePaymentSuccessModalClose}
          show={showSuccessModal}
          streamId={(item as any)?.id}
        />
        {showAddCardModal ? (
          <AddCardModal
            show={showAddCardModal}
            handleClose={handleAddCardModalClose}
            handleCardSelect={handleCardSelectModalOpen}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default GameCard;
