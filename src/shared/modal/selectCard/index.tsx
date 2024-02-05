import { AddCardIcon, CrossArrowIcon, DebitCardIcon, TickIcon } from "assets";
import CardLoaders from "./cardLoaders";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import NotContents from "shared/default/notContent";
import { getAllCard, makeDefaultCard } from "shared/services/cardService";
import { subscribePackage } from "shared/services/packageService";
import { classNames } from "shared/utils/helper";
import PaymentSuccessModal from "../paymentSuccess";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { toastMessage } from "shared/components/toast";
interface ModalProps {
  show: boolean;
  plan?: any;
  handleClose: () => void;
  handlePayment: () => void;
  handleAddCard: () => void;
  handleSuccessModalOpen: () => void;
}

function SelectCardModal({
  show,
  handleClose,
  handlePayment,
  handleAddCard,
  handleSuccessModalOpen,
  plan,
}: ModalProps) {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const [activeCard, setActiveCard] = useState<number>(3890);

  const [loading, setLoading] = useState<boolean>(false);
  const [subscrbeLoading, setSubscrbeLoading] = useState<boolean>(false);
  const [cardList, setCardList] = useState<any>([]);

  useEffect(() => {
    listAllCard();
  }, []);

  const handleActiveCard = (val: any) => {
    let obj = {
      card_id: val?.id,
    };
    makeDefaultCard(obj)
      .then(({ data }) => {
        let cloneList = [...cardList];
        let findindx = cloneList.findIndex((ii) => ii.is_default == 1);
        if (findindx > -1) {
          cloneList[findindx].is_default = 0;
        }
        let selectIndx = cloneList.findIndex((ii) => ii.id == val?.id);
        if (selectIndx > -1) {
          cloneList[selectIndx].is_default = 1;
        }
        setCardList(cloneList);
        setActiveCard(val);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const listAllCard = () => {
    setLoading(true);
    getAllCard()
      .then(
        ({
          data: {
            data: { cards },
          },
        }) => {
          setCardList(cards);
        }
      )
      .catch((err) => {
        console.log("card err", err);
      })
      .finally(() => setLoading(false));
  };
  const handleSubscribe = () => {
    setSubscrbeLoading(true);
    let obj = {
      type: (plan as any)?.type,
      to_user_id: (plan as any)?.user_id,
    };
    subscribePackage(obj)
      .then(({ data }) => {
        if (data?.data?.is_subscribed) {
          handleClose();
          handleSuccessModalOpen();
        } else {
          toastMessage("error", data?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setSubscrbeLoading(false));
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
                handlePayment();
              }}
            />
          </div>
          <div className={classNames(styles.container)}>
            <Heading title={`Select Card`} headingStyle={styles.headingStyle} />
            <label className={classNames(styles.subtitle, "mt-2")}>
              Select your credit card to proceed.
            </label>
            <br />

            {loading ? (
              <CardLoaders />
            ) : (
              <div
                className={classNames(
                  "d-flex flex-column justify-content-start align-items-center pt-4 pb-2 w-100 gap-2",
                  styles.cardTopContainer
                )}
              >
                {cardList?.length > 0 ? (
                  cardList?.map((card: any, ind: number) => {
                    return (
                      <Card
                        value={card}
                        activeCard={activeCard}
                        key={ind}
                        handleActiveCard={handleActiveCard}
                      />
                    );
                  })
                ) : (
                  <NotContents msg="No Card Found Yet!" />
                )}
              </div>
            )}
            {cardList?.length < 3 ? (
              <div
                className={classNames(
                  "d-flex justify-content-start align-items-center pt-2 pb-4"
                )}
                onClick={() => {
                  handleClose();
                  handleAddCard();
                }}
                role={"button"}
              >
                <AddCardIcon className={classNames(styles.addIcon)} />
                <label
                  className={classNames(styles.addlabel, "ms-1")}
                  role={"button"}
                >
                  Add Card
                </label>
              </div>
            ) : (
              ""
            )}

            {cardList?.length ? (
              <CustomButton
                title="Continue"
                isDisable={subscrbeLoading}
                loading={subscrbeLoading}
                containerStyle={classNames(styles.btnStyle)}
                submitHandle={() => {
                  handleSubscribe();
                }}
              />
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

interface CardProps {
  value: any;
  activeCard: number;
  handleActiveCard: (val: number) => void;
}

const Card = ({ value, activeCard, handleActiveCard }: CardProps) => {
  return (
    <div
      className={classNames(styles.cardContainer, "px-2 position-relative")}
      style={activeCard === value ? { borderColor: "#6c5dd3" } : {}}
      role={"button"}
      onClick={() => {
        handleActiveCard(value);
      }}
    >
      <div className={classNames(styles.cardImgContainer)}>
        <DebitCardIcon className={classNames(styles.cardImg)} />
      </div>
      <div
        className={classNames(
          "d-flex flex-column  justify-content-center align-items-start ms-3"
        )}
      >
        <label className={classNames(styles.cardType)} role={"button"}>
          Credit / Debit Card
        </label>
        <label className={classNames(styles.cardValue)} role={"button"}>
          •••• •••• •••• {value?.last_4}
        </label>
      </div>
      {value?.is_default ? (
        <div className={classNames(styles.selectedPlan)}>
          <TickIcon className={styles.tickStyle} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SelectCardModal;
