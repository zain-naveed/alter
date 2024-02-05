import { LiveIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/customButton";
import { socket } from "shared/services/socketService";
import { roundNum } from "shared/utils/helper";
import "../style.scss";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { checkStreamSubscriptionStatus } from "shared/services/streamService";
import { routeConstant } from "shared/routes/routeConstant";
import AddCardModal from "shared/modal/AddCard";
import PaymentPlansModal from "shared/modal/paymentPlans";
import PaymentSuccessModal from "shared/modal/paymentSuccess";
import SelectCardModal from "shared/modal/selectCard";

const SingleSlide = ({ item, isLive, index }: any) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const navigate = useNavigate();
  const [watching, setWatching] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<any>(null);
  const [showCardSelectModal, setShowCardSelectModal] =
    useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [selectPlan, setSelectPlan] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [streamsId, setStreamId] = useState<any>("");
  const handleNavigate = (item: any) => {
    if (isLive) {
      navigate(
        routeConstant.streamDetail.path.replace(":id", "") + item?.stream_id
      );
    } else {
      navigate(routeConstant.streamDetail.path.replace(":id", "") + item?.id);
    }
  };
  const handlePaymentModalOpen = (item?: any) => {
    setShowPaymentModal(true);
    if (isLive) {
      if (item) {
        setSelectUser({
          id: item?.user_id,
        });
      }
    } else {
      if (item) {
        setSelectUser(item?.user);
      }
    }
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
  const handleViews = (data: any) => {
    setWatching(data);
  };
  useEffect(() => {
    if (isLive) {
      if (socket.id) {
        socket.emit("join_room", { stream_id: String(item?.stream_id) });
        socket.on("views", handleViews);
        socket.on("disconnect", () => {
          socket.emit("leave_room", { stream_id: String(item?.stream_id) });
          socket.removeListener("views", handleViews);
        });
      }
    }
  }, [socket.id]);
  return (
    <>
      <div
        key={index}
        className={classNames("position-relative cover-preview")}
      >
        <img
          className={classNames("cover-preview-img")}
          src={item?.thumbnail_base_url + item?.thumbnail}
          alt="cover-preview"
        />
        <div className={classNames("linear-gradient")} />
        <div className={classNames("cover-content col-10 col-md-6")}>
          <div className={classNames("d-flex align-items-center")}>
            {isLive ? (
              <div className={classNames("liveContainer")}>
                <LiveIcon className={classNames("liveIcon")} />
                <label className={classNames("liveLabel ms-1")}>Live</label>
              </div>
            ) : null}

            <div
              className={classNames("dot ms-3", !isLive ? "dot-blue" : "")}
            />
            <label className={classNames("viewLabel ms-1")}>
              {roundNum(
                isLive
                  ? watching
                    ? watching
                    : 0
                  : item?.views
                  ? item?.views
                  : 0,
                0
              )}
              {isLive ? " watching" : " view" + `${item?.views > 1 ? "s" : ""}`}
            </label>
          </div>

          <label className={classNames("streamTitle")}>
            {isLive ? item?.stream_title : item?.title}
          </label>
          <div className={classNames("stream-btn-container my-3")}>
            <CustomButton
              title="Watch Stream"
              submitHandle={() => {
                handleNavigate(item);
              }}
              isDisable={loading}
              loading={loading}
            />
          </div>
        </div>
      </div>
      {showPaymentModal ? (
        <PaymentPlansModal
          show={showPaymentModal}
          setSelectPlan={setSelectPlan}
          selectPlan={selectPlan}
          user={selectUser}
          handleClose={handlePaymentModalClose}
          handleCardSelect={handleCardSelectModalOpen}
        />
      ) : null}
      {showCardSelectModal ? (
        <SelectCardModal
          show={showCardSelectModal}
          handleClose={handleCardSelectModalClose}
          handlePayment={handlePaymentModalOpen}
          handleAddCard={handleAddCardModalOpen}
          handleSuccessModalOpen={handlePaymentSuccessModalOpen}
          plan={selectPlan}
        />
      ) : null}
      <PaymentSuccessModal
        handleClose={handlePaymentSuccessModalClose}
        show={showSuccessModal}
        streamId={streamsId}
      />
      {showAddCardModal ? (
        <AddCardModal
          show={showAddCardModal}
          handleClose={handleAddCardModalClose}
          handleCardSelect={handleCardSelectModalOpen}
        />
      ) : null}
    </>
  );
};

export default SingleSlide;
