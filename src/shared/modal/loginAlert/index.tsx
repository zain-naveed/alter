import { LoginAlertIcon } from "assets";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { resetLiveUsers } from "shared/redux/reducers/liveUsersSlice";
import { resetRouteReducer } from "shared/redux/reducers/routeSlice";
import { resetSearch } from "shared/redux/reducers/searchSlice";
import { resetShortOptions } from "shared/redux/reducers/shortSlice";
import { resetUser } from "shared/redux/reducers/userSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { Logout } from "shared/services/authService";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoginAlert = ({ show, handleClose }: ModalProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    let formData = new FormData();
    Logout(formData).then(({ data: { data, status, message } }) => {
      if (status) {
        dispatch(resetUser());
        dispatch(resetRouteReducer());
        dispatch(resetSearch());
        dispatch(resetLiveUsers());
        dispatch(resetShortOptions());
      } else {
        console.log("error", message);
      }
    });
  };
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
          <div className={classNames(styles.container)}>
            <Heading
              title={`Login to Interact!`}
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle, "mt-2")}>
              You can enjoy watching the stream but you’re unable to like or
              comment until you log in.
            </label>
            <br />
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center py-4"
              )}
            >
              <LoginAlertIcon className={classNames(styles.trashIcon)} />
            </div>
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center"
              )}
            >
              <CustomButton
                title="Maybe Later"
                containerStyle={classNames(styles.cancelbtnStyle, "me-2")}
                submitHandle={() => {
                  handleClose();
                }}
              />
              <CustomButton
                title="Login Now"
                containerStyle={classNames(styles.deletebtnStyle, "me-2")}
                submitHandle={() => {
                  navigate(routeConstant.login.path);
                  handleLogout();
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginAlert;
