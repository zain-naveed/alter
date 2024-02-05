import { CrossArrowIcon } from "assets";
import { Formik } from "formik";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import CustomCardNumberInput from "shared/components/customCardNumberInput";
import CustomCvcInput from "shared/components/customCvc";
import CustomExpiryInput from "shared/components/customExpiryInput";
import CustomInput from "shared/components/customInput";
import Heading from "shared/components/heading";
import { toastMessage } from "shared/components/toast";
import { addCard } from "shared/services/cardService";
import { server_add_card } from "shared/utils/constants";
import { classNames, createStripeToken } from "shared/utils/helper";
import { addCardVS } from "shared/utils/validations";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  handleCardSelect: () => void;
  submitCardTitle?: string;
  updateListCard?: any;
}
interface initialValue {
  cardHolderName: string;
  number: string;
  expiry: string;
  code: string;
}

function AddCardModal({
  show,
  handleClose,
  handleCardSelect,
  submitCardTitle,
  updateListCard,
}: ModalProps) {
  // eslint-disable-next-line
  let initValue: initialValue = {
    cardHolderName: "",
    number: "",
    expiry: "",
    code: "",
  };
  const [loading, setLoading] = useState(false);

  const handleAddCard = (stripeDtail: any) => {
    let obj = {
      number: stripeDtail?.number,
      cvc: stripeDtail?.code,
      exp_month: stripeDtail?.expiry.split("/")[0].replace(" ", ""),
      exp_year: stripeDtail?.expiry.split("/")[1].replace(" ", ""),
      name: stripeDtail?.cardHolderName,
    };
    setLoading(true);
    createStripeToken(obj, (resp: any) => {
      if (resp.status) {
        let obj = {
          card_id: resp?.data?.card?.id,
          card_token: resp?.data?.id,
          last_4: resp?.data?.card?.last4,
          expiry: stripeDtail?.expiry,
        };

        addCard(obj)
          .then(({ data: { data, status, message } }) => {
            console.log("data", data);
            if (status) {
              if (server_add_card.addCard == data?.card_added) {
                if (updateListCard) {
                  updateListCard();
                }
                handleClose();
                handleCardSelect();
              } else if (server_add_card.notStripe == data?.card_added) {
                toastMessage("error", message);
              } else if (server_add_card.alreadyStripe == data?.card_added) {
                toastMessage("error", message);
              }
            } else {
              toastMessage("error", message);
            }
          })
          .catch((err) => console.log(err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
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
          <div className={styles.header}>
            <CrossArrowIcon
              className={styles.pointer}
              onClick={() => {
                handleClose();
                handleCardSelect();
              }}
            />
          </div>
          <Formik
            initialValues={initValue}
            onSubmit={(values, action) => {
              handleAddCard(values);
            }}
            validationSchema={addCardVS}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }: any) => (
              <div className={classNames("container", styles.container)}>
                <div className={"mb-3"}>
                  <Heading
                    title="Card Details"
                    headingStyle={styles.headingStyle}
                  />
                </div>
                <div className={"mb-4"}>
                  <CustomInput
                    label="Card Holder Name"
                    placeholder="Enter Name"
                    value={values.cardHolderName}
                    onChange={handleChange("cardHolderName")}
                    required
                    error={
                      touched.cardHolderName && errors.cardHolderName
                        ? errors.cardHolderName
                        : ""
                    }
                  />
                </div>
                <div className={"mb-4"}>
                  <CustomCardNumberInput
                    label="Card Number"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    value={values.number}
                    onFieldChange={setFieldValue}
                    required
                    error={touched.number && errors.number ? errors.number : ""}
                  />
                </div>
                <div className={"mb-4"}>
                  <CustomExpiryInput
                    label="Expiry Date"
                    placeholder="mm/yy"
                    value={values.expiry}
                    onFieldChange={setFieldValue}
                    required
                    error={touched.expiry && errors.expiry ? errors.expiry : ""}
                  />
                </div>
                <div className={"mb-4"}>
                  <CustomCvcInput
                    label="CSV/CVV"
                    placeholder="••••••"
                    value={values.code}
                    type="password"
                    required
                    onFieldChange={setFieldValue}
                    error={touched.code && errors.code ? errors.code : ""}
                  />
                </div>

                <CustomButton
                  loading={loading}
                  isDisable={loading}
                  title={submitCardTitle ? submitCardTitle : "Save Card"}
                  submitHandle={() => handleSubmit()}
                />
              </div>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddCardModal;
