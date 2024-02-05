import { CrossArrowIcon } from "assets";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { routeConstant } from "shared/routes/routeConstant";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  isStream: boolean;
  handleSubmit:any;
  id?:string
}

function ShareModal({ show, handleClose, isStream,handleSubmit,id }: ModalProps) {
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
          <div className={classNames("container", styles.container)}>
            <Heading
              title={`Share ${isStream ? "Stream" : "Short"}`}
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle, "mt-4")}>
              You can copy the link given below and share with your friends.
            </label>
            <br />
            <label className={classNames(styles.copyLabel, "mt-4")}>
              Copy Link
            </label>
            <div className={classNames(styles.fieldContainer, "mt-1 justify-content-between")}>
              <label className={classNames(styles.shareLink, "px-2")}>
                {!isStream ?  window.location.protocol+"//" + window.location.host + routeConstant.shareShortDetail.path.replace(":id","")+id:window.location.href}
                {/* https://www.alter.com/shorts/tHp1fkeUpM8?q130lTDaua0?feature=share */}
              </label>
              <CustomButton
                title="Copy"
                submitHandle={handleSubmit}
                containerStyle={classNames(styles.btnStyle, "me-2")}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShareModal;
