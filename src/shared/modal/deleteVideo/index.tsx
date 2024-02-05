import { CrossArrowIcon, TrashModalIcon } from "assets";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  isStream?: boolean;
  title?: string;
  Icon?: any;
  loader?: boolean;
  handleAction?: any;
}

function DeleteVideoModal({
  show,
  handleClose,
  isStream,
  title,
  Icon,
  loader,
  handleAction,
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
              title={`Are you sure?`}
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle, "mt-2")}>
              {title
                ? title
                : isStream
                ? "You are about to delete your past stream."
                : "You are about to delete your short."}
            </label>
            <br />
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center py-4"
              )}
            >
              {Icon ? (
                <Icon className={classNames(styles.trashIcon)} />
              ) : (
                <TrashModalIcon className={classNames(styles.trashIcon)} />
              )}
            </div>
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center"
              )}
            >
              <CustomButton
                title="Cancel"
                containerStyle={classNames(styles.cancelbtnStyle, "me-2")}
                submitHandle={() => {
                  handleClose();
                }}
              />
              <CustomButton
                title={title ? "Remove" : "Delete"}
                containerStyle={classNames(styles.deletebtnStyle, "me-2")}
                submitHandle={handleAction}
                loading={loader}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DeleteVideoModal;
