import { CancelSubIcon, CrossArrowIcon } from "assets";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  handleBack?: () => void;
  handleSubmit: () => void;
  loader: boolean;
}

function CancelSubscription({
  show,
  handleClose,
  handleBack,
  loader,
  handleSubmit,
}: ModalProps) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        centered
        contentClassName={styles.modalContent}
      >
        <Modal.Body className={styles.modalContent}>
          <div className={styles.header}>
            <CrossArrowIcon
              className={styles.pointer}
              onClick={() => {
                handleClose();
                if (handleBack) {
                  handleBack();
                }
              }}
            />
          </div>
          <div className={classNames(styles.container)}>
            <Heading
              title={`Are you sure?`}
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle, "mt-2")}>
              Are you sure you want to cancel subscription?
            </label>
            <br />
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center py-4"
              )}
            >
              <CancelSubIcon className={classNames(styles.trashIcon)} />
            </div>
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center"
              )}
            >
              <CustomButton
                title="Not Now"
                containerStyle={classNames(styles.cancelbtnStyle, "me-2")}
                submitHandle={() => {
                  handleClose();
                  if (handleBack) {
                    handleBack();
                  }
                }}
              />
              <CustomButton
                title="UnSubscribe"
                containerStyle={classNames(styles.deletebtnStyle, "me-2")}
                loading={loader}
                isDisable={loader}
                submitHandle={() => {
                  handleSubmit();
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CancelSubscription;
