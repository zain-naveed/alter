import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  CrossArrowIcon,
  DollarIcon,
  DonationFailIcon,
  DonationSuccessIcon,
  TickIcon,
} from "assets";
import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import Heading from "shared/components/heading";
import { addDonation } from "shared/services/paymentService";
import { PaypalClientId } from "shared/utils/endpoints";
import { classNames, isNumberCheck } from "shared/utils/helper";
import PaymentSuccessModal from "../paymentSuccess";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { toastMessage } from "shared/components/toast";
import { socket } from "shared/services/socketService";
import { addShortComment } from "shared/services/shortService";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  otherUser: any;
  isLive: boolean;
  streamId: any;
  isShort: boolean;
  isProfile: boolean;
  shortId: any;
  isSubscriber: boolean;
}
const prices: {
  value: string;
}[] = [
  {
    value: "5",
  },
  {
    value: "10",
  },
  {
    value: "15",
  },
  {
    value: "20",
  },
];

function DonateModal({
  show,
  handleClose,
  otherUser,
  isLive,
  streamId,
  isShort,
  isProfile,
  shortId,
  isSubscriber,
}: Partial<ModalProps>) {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const [donatePrice, setDonationPrice] = useState<string>("5");
  const donatePriceRef = useRef<string>("5");
  const [isNumber, setIsNumber] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orderID, setOrderID] = useState(false);
  const handleDonation = (val: string) => {
    setDonationPrice(val);
    donatePriceRef.current = val;
  };
  function myKeyPress(e: any) {
    if (e.code === "Backspace") {
      setIsNumber(true);
    } else {
      setIsNumber(isNumberCheck(e));
    }
  }

  const inputHandler = (text: string) => {
    if (isNumber) {
      if (Number(text) > 0 && text.length < 8) {
        setDonationPrice(text.replace(".", ""));
        donatePriceRef.current = text.replace(".", "");
      }
    }
  };

  const handleCommentSubmit = (id: any, message: any) => {
    let obj = {
      short_id: id,
      content: message,
      type: "1",
    };

    addShortComment(obj)
      .then(({ data: { data, status } }) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // creates a paypal order
  const createOrder = (data: any, actions: any) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: donatePriceRef.current,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: donatePriceRef.current,
                },
              },
            },
            payee: {
              email_address: "sb-bprka26037417@business.example.com",
            },
            items: [
              {
                name: "donation-example",
                quantity: "1",
                unit_amount: {
                  currency_code: "USD",
                  value: donatePriceRef.current,
                },
                category: "DONATION",
              },
            ],
          },
        ],
      })
      .then((orderID: any) => {
        setOrderID(orderID);
        return orderID;
      });
  };

  // check Approval
  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      let formdata = new FormData();
      formdata.append("from_user_id", user?.id);
      formdata.append("to_user_id", otherUser?.id);
      formdata.append("type", "0");
      formdata.append("tool", "paypal");
      formdata.append("amount", donatePriceRef.current);
      formdata.append("transaction_id", details?.id);
      formdata.append("json", details);
      if (isLive) {
        socket.emit("join_room", { stream_id: String(streamId) });
        let socketObj = {
          stream_id: String(streamId),
          content: `Just Donated $${Number(donatePriceRef.current)}`,
          user_id: user?.id,
          type: "create",
          selection: "1",
          is_star: false,
          streamer_id: otherUser?.id,
        };
        if (isSubscriber) {
          socketObj.is_star = true;
        }

        socket.emit("comment_action", socketObj);
      }
      if (streamId) {
        formdata.append("donation_type", "2");
        formdata.append("donation_type_id", streamId);
      } else if (isShort) {
        formdata.append("donation_type", "1");
        formdata.append("donation_type_id", shortId);
        handleCommentSubmit(
          shortId,
          `Just Donated $${Number(donatePriceRef.current)}`
        );
      } else if (isProfile) {
        formdata.append("donation_type", "0");
        formdata.append("donation_type_id", user?.id);
      }

      addDonation(formdata)
        .then(({ data: { data, status, message } }) => {
          if (status) {
            toastMessage("success", "Donation Sent Successfully!");
            handleClose?.();
            setSuccess(true);
            setShowModal(true);
          }
        })
        .catch((err) => {
          console.log(err);
          handleClose?.();
          setSuccess(false);
          setShowModal(true);
        });
    });
  };

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
          <PayPalScriptProvider
            options={{ "client-id": PaypalClientId, components: "buttons" }}
          >
            <div className={styles.header}>
              <CrossArrowIcon
                className={styles.pointer}
                onClick={() => {
                  handleClose?.();
                }}
              />
            </div>
            <div className={classNames(styles.container)}>
              <Heading
                title={`Send Some Gift`}
                headingStyle={styles.headingStyle}
              />
              <label className={classNames(styles.subtitle, "mt-2")}>
                Send some amount as gift to your favorite streamer.
              </label>
              <br />
              <label className={classNames(styles.fieldLabel, "pt-3")}>
                Choose Amount{" "}
                <label className={classNames(styles.asterik)}>*</label>
              </label>
              <div
                className={classNames(
                  "d-flex  justify-content-center align-items-center pb-3 w-100 gap-2"
                )}
              >
                {prices.map((price, ind) => {
                  return (
                    <Card
                      value={price.value}
                      donatePrice={donatePrice}
                      key={ind}
                      handleActiveCard={handleDonation}
                    />
                  );
                })}
              </div>

              <label className={classNames(styles.fieldLabel)}>
                Or Enter Custom Amount{" "}
                <label className={classNames(styles.asterik)}>*</label>
              </label>
              <div
                className={classNames(
                  "d-flex align-items-center mb-4 mt-1",
                  styles.inputContainer
                )}
              >
                <div className={classNames(styles.dollarIconContainer)}>
                  <DollarIcon className={classNames(styles.dollarIcon)} />
                </div>
                <input
                  type={"number"}
                  value={donatePrice}
                  placeholder="12"
                  className={classNames(styles.inputStyle)}
                  onKeyDown={(e) => myKeyPress(e)}
                  onChange={(e) => inputHandler(e.target.value)}
                />
              </div>

              <PayPalButtons
                fundingSource="paypal"
                style={{ layout: "vertical", label: "donate", color: "blue" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  setSuccess(false);
                  setShowModal(true);
                  handleClose?.();
                }}
              />
            </div>
          </PayPalScriptProvider>
        </Modal.Body>
      </Modal>
      <PaymentSuccessModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={success ? "Donation Sent Successfully" : "Something Went Wrong!"}
        subtitle={
          success
            ? "Congratulations! Your donation has been sent successfully."
            : "Oho! it seems your donation is not sent. Please enable paypal account from your settings first."
        }
        actionHandle={() => {
          if (success) {
            setShowModal(false);
          } else {
            setShowModal(false);
          }
        }}
        btnText={success ? "Ok, Thanks" : "Go to Settings"}
        Icon={success ? DonationSuccessIcon : DonationFailIcon}
      />
    </>
  );
}

interface CardProps {
  value: string;
  donatePrice: string;
  handleActiveCard: (val: string) => void;
}

const Card = ({ value, donatePrice, handleActiveCard }: CardProps) => {
  return (
    <div
      className={classNames(styles.cardContainer, "px-2 position-relative")}
      style={donatePrice === value ? { borderColor: "#6c5dd3" } : {}}
      role={"button"}
      onClick={() => {
        handleActiveCard(value);
      }}
    >
      <div
        className={classNames(
          "d-flex  justify-content-start align-items-center"
        )}
      >
        <label className={classNames(styles.priceLabel)} role={"button"}>
          ${value}
        </label>
      </div>
      {donatePrice === value && (
        <div className={classNames(styles.selectedPlan)}>
          <TickIcon className={styles.tickStyle} />
        </div>
      )}
    </div>
  );
};

export default DonateModal;
