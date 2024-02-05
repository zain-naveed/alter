import { ShortsSuccessIcon } from "assets";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
}

function ShortSuccess({ show, handleClose }: ModalProps) {
  const navigate = useNavigate();
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
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
          <div className={classNames("container", styles.container)}>
            <Heading
              title={`Your Short Uploaded Successfully`}
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle)}>
              Your short has been uploaded succesfully.
            </label>
            <br />
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center py-4"
              )}
            >
              <ShortsSuccessIcon />
            </div>

            <CustomButton
              title="Go to My Shorts"
              containerStyle={classNames(styles.btnStyle, "me-2")}
              submitHandle={() => {
                handleClose();
                navigate(`/profile/${user.id}`, {
                  state: {
                    selectType: "Shorts",
                  },
                });
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShortSuccess;
