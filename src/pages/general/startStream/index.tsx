import { startStreamBg, UploadIcon } from "assets";
import classNames from "classnames";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Title from "shared/components/title";
import { toastMessage } from "shared/components/toast";
import PreviewStream from "shared/modal/previewStream";
import StreamModal from "shared/modal/streamModal";
import { resetStream } from "shared/redux/reducers/streamSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { getStreamStatus } from "shared/services/streamService";
import styles from "./style.module.scss";
const StartStream = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [previewShow, setPreviewShow] = useState<boolean>(false);
  const closeModal = () => setShow(!show);
  const showModal = () => setShow(true);
  const preivewCloseModal = () => setPreviewShow(!previewShow);
  const showPreivewModal = () => setPreviewShow(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStartStream = () => {
    setLoading(true);
    getStreamStatus()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (!data?.go_to_online) {
            if (message === "Attach Stripe account first") {
              navigate(routeConstant.setting.path, {
                state: {
                  selectType: "Payments",
                },
              });
              toastMessage("Error", message);
            } else if (message === "Please add package") {
              navigate(routeConstant.setting.path, {
                state: {
                  selectType: "Manage Subscriptions",
                },
              });
              toastMessage("Error", message);
            } else {
              toastMessage("Error", message);
            }
          } else {
            dispatch(resetStream());
            showModal();
          }
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className={classNames(
        styles.customContainer,
        "d-flex flex-column align-items-center",
        styles.mainContainer
      )}
    >
      <div className={classNames("mb-4 mt-2", styles.containWidth)}>
        <Heading
          title="Start Your Stream"
          headingStyle={classNames(styles.heading, "mt-3")}
        />
      </div>

      <div
        className={classNames(
          "position-relative",
          styles.contentContainer,
          "mb-4"
        )}
      >
        <img
          src={startStreamBg}
          className={classNames(styles.bgImg)}
          alt="bg-img"
        />
        <div className={styles.content}>
          <Heading
            title="Start a Live Stream"
            headingStyle={styles.contentTitle}
          />
          <Title
            title="Setup a stream to start a new live video now"
            titleStyle={styles.contentSubTitle}
          />

          <CustomButton
            title="Go Live"
            Icon={UploadIcon}
            containerStyle={classNames(styles.btnStyle, "mt-4")}
            iconStyle={classNames(styles.iconStyle, "me-2")}
            submitHandle={handleStartStream}
            loading={loading}
            isDisable={loading}
          />
        </div>
      </div>
      <PreviewStream
        show={previewShow}
        handleClose={preivewCloseModal}
        streamModal={showModal}
      />
      <StreamModal
        show={show}
        preivewModal={showPreivewModal}
        handleClose={closeModal}
      />
    </div>
  );
};

export default StartStream;
