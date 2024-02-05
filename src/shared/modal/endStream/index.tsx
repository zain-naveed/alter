import { CrossArrowIcon, EndStreamIcon, TrashModalIcon } from "assets";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  show: any;
  handleClose: any;
  handleAction?: any;
  handleEnd?: any;
}

function EndStreamAlert({
  show,
  handleClose,
  handleAction,
  handleEnd,
}: ModalProps) {
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
            <CrossArrowIcon className={styles.pointer} onClick={handleClose} />
          </div>
          <div className={classNames(styles.container)}>
            <Heading
              title={`You are About to Quite Your Stream!`}
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle, "mt-2")}>
              If you navigate away from your screen the live video will end. Do
              you want to continue & end live video?
            </label>
            <br />
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center py-4"
              )}
            >
              <EndStreamIcon className={classNames(styles.trashIcon)} />
            </div>
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center"
              )}
            >
              <CustomButton
                title={"End Live Video"}
                containerStyle={classNames(styles.deletebtnStyle, "me-2")}
                submitHandle={() => {
                  handleAction();
                  handleEnd();
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EndStreamAlert;
