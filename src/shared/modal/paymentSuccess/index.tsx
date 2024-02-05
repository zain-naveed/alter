import { CrossArrowIcon, PaymentSuccessIcon } from "assets";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  subtitle: string;
  actionHandle: () => void;
  Icon: any;
  btnText: string;
  streamId:any;
}

function PaymentSuccessModal({
  show,
  handleClose,
  title,
  subtitle,
  actionHandle,
  Icon,
  btnText,
  streamId
}: Partial<ModalProps>) {
  const navigate = useNavigate();
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        contentClassName={styles.modalContent}
      >
        <Modal.Body className={styles.modalContent}>
          <div className={styles.header}>
            <CrossArrowIcon
              className={styles.pointer}
              onClick={() => {
                handleClose?.();
              }}
            />
          </div>
          <div className={classNames("container", styles.container)}>
            <Heading
              title={title ? title : `Payment Successfull`}
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle)}>
              {subtitle
                ? subtitle
                : "Your payment has been successful. You can now enjoy streaming."}
            </label>
            <br />
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center py-4"
              )}
            >
              {Icon ? <Icon /> : <PaymentSuccessIcon />}
            </div>
            <CustomButton
              title={btnText ? btnText : "Continue to Stream"}
              containerStyle={classNames(styles.btnStyle, "me-2")}
              submitHandle={() => {
                if (actionHandle) {
                  actionHandle();
                } else {
                  handleClose?.();
                  navigate(`/stream/${streamId}`);
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PaymentSuccessModal;
