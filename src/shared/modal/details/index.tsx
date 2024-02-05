import { CrossArrowIcon, defaultAvatar } from "assets";
import moment from "moment";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  title: string;
  show: boolean;
  item: any;
  handleClose: () => void;
  handleChangePlan: () => void;
  handleUnSubscribe: () => void;
  isTransaction: boolean;
  isDonation: boolean;
}

function DetailsModal({
  title,
  show,
  item,
  handleClose,
  handleChangePlan,
  handleUnSubscribe,
  isTransaction,
  isDonation,
}: Partial<ModalProps>) {
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
            <CrossArrowIcon className={styles.pointer} onClick={handleClose} />
          </div>
          <div className={classNames(styles.container)}>
            <Heading title={title} headingStyle={styles.headingStyle} />

            <div
              className={classNames(
                "d-flex flex-column justify-content-center align-items-center pt-3 w-100"
              )}
            >
              <img
                src={
                  item?.avatar
                    ? item?.social_login_id
                      ? item?.avatar
                      : item?.base_url + item?.avatar
                    : defaultAvatar
                }
                alt="user-pic"
                className={classNames(styles.userImg)}
              />
              <label className={classNames(styles.name, "mt-2")}>
                {item?.name}
              </label>
              <label className={classNames(styles.subtitle)}>
                {"@" + item?.user_name}
              </label>
            </div>
            <div
              className={classNames(
                "d-flex flex-column justify-content-center align-items-center py-3 w-100"
              )}
            >
              <div
                className={classNames(
                  "d-flex  justify-content-between align-items-center w-100 py-3",
                  styles.detailContainer
                )}
              >
                <label className={classNames(styles.detailTitle)}>Amount</label>
                <label className={classNames(styles.detailValue)}>
                  ${item?.amount}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex  justify-content-between align-items-center w-100 py-3",
                  styles.detailContainer
                )}
              >
                <label className={classNames(styles.detailTitle)}>
                  {isDonation ? "Date" : "Billing Date"}
                </label>
                <label className={classNames(styles.detailValue)}>
                  {moment.utc(item?.billing_date).local().format("MMM DD,YYYY")}
                </label>
              </div>
              {!isDonation && (
                <div
                  className={classNames(
                    "d-flex  justify-content-between align-items-center w-100 py-3",
                    styles.detailContainer
                  )}
                >
                  <label className={classNames(styles.detailTitle)}>Plan</label>
                  <label className={classNames(styles.detailValue)}>
                    {item?.package_type}
                  </label>
                </div>
              )}
              <div
                className={classNames(
                  "d-flex  justify-content-between align-items-center w-100 py-3",
                  styles.detailContainer
                )}
              >
                <label className={classNames(styles.detailTitle)}>Status</label>
                <label className={classNames(styles.detailValue)}>
                  {item?.status}
                </label>
              </div>
            </div>
            {!isTransaction && !isDonation && (
              <div
                className={classNames(
                  "d-flex justify-content-between align-items-center pt-3"
                )}
              >
                {!item?.cancelled_at ? (
                  <>
                    <CustomButton
                      title="Change Plan"
                      containerStyle={classNames(styles.changeBtn)}
                      submitHandle={() => {
                        handleClose?.();
                        handleChangePlan?.();
                      }}
                    />
                    <CustomButton
                      title="Cancel Subscription"
                      containerStyle={classNames(styles.canceBtn)}
                      submitHandle={() => {
                        handleClose?.();
                        handleUnSubscribe?.();
                      }}
                    />
                  </>
                ) : null}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DetailsModal;
