import {
  ActiveCard,
  AddCardIcon,
  BackArrowIcon,
  MoreIcon,
  purpleCard,
  RemoveStripe,
  StripeIcon,
  YellowCard,
} from "assets";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import CardDropDown from "shared/components/cardDropdown";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Pagination from "shared/components/pagination";
import Title from "shared/components/title";
import { toastMessage } from "shared/components/toast";
import TransactionTable from "shared/components/transactionTable";
import NotRecord from "shared/default/notRecord";
import AddCardModal from "shared/modal/AddCard";
import DeleteVideoModal from "shared/modal/deleteVideo";
import { routeConstant } from "shared/routes/routeConstant";
import {
  getAllCard,
  makeDefaultCard,
  removeCard,
} from "shared/services/cardService";
import {
  checStripeAccount,
  connectAccountToStripe,
  disConnectStripe,
  getUserPayment,
} from "shared/services/settingsService";
import { table_Heading } from "shared/utils/constants";
import { classNames } from "shared/utils/helper";
import CardLoader from "./cardLoader";
import styles from "./style.module.scss";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [lastPages, setLastPage] = useState<number>(0);
  const [changePage, seChngetPage] = useState<number>(1);
  const [viewAll, setViewAll] = useState<number>(3);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [addCard, setAddCard] = useState<boolean>(true);
  const [stripeLoading, setStripeLoading] = useState<boolean>(false);
  const [disConnectLoading, setDisconnectLoading] = useState<boolean>(false);
  const [historyLoader, setHistoryLoader] = useState<boolean>(false);
  const [tranHistry, setTranHistory] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [cardLoading, setCardLoading] = useState<boolean>(false);
  const [showCardSelectModal, setShowCardSelectModal] =
    useState<boolean>(false);
  const handleAddCardModalOpen = () => {
    setShowAddCardModal(true);
  };
  const handleAddCardModalClose = () => {
    setShowAddCardModal(false);
  };
  const handleCardSelectModalOpen = () => {
    setShowCardSelectModal(true);
  };
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };
  const handleDisconnectStripe = () => {
    setDisconnectLoading(true);
    disConnectStripe()
      .then(({ data: { status, message, data } }) => {
        if (status) {
          setShowDeleteModal(false);
          setAddCard(data?.disconnect);
          setCardList([]);
          toastMessage("success", message);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => console.log("disconnectStipe", err))
      .finally(() => setDisconnectLoading(false));
  };
  const handleDeleteModalOpen = () => {
    if (!addCard) {
      setShowDeleteModal(true);
    } else {
      window.location.href =
        "https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_NuuRIyUI2VrNJQp3gi5cGKNUw1tCBWOi";
      // setAddCard(false);
    }
  };
  useEffect(() => {
    checkStripConnected();
    getPayment();
    listAllCard();
  }, []);
  const getPayment = () => {
    setHistoryLoader(true);
    getUserPayment(page)
      .then(({ data: { data } }) => {
        setLastPage(data?.last_page);
        setTranHistory(data?.transaction);
      })
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setHistoryLoader(false);
      });
  };
  const listAllCard = () => {
    setCardLoading(true);
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
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => setCardLoading(false));
  };
  useEffect(() => {
    if (location?.search) {
      stripeAccount();
    }
  }, [location?.search]);
  const stripeAccount = () => {
    setStripeLoading(true);
    let code = location?.search.replace("?code=", "");
    let obj = {
      connected_account_id: code,
    };
    connectAccountToStripe(obj)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          navigate(routeConstant.setting.path, {
            state: {
              selectType: "Payments",
            },
          });
          setAddCard(!addCard);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => setStripeLoading(false));
  };
  const checkStripConnected = () => {
    checStripeAccount()
      .then(({ data: { status, data } }) => {
        if (status) {
          setAddCard(!data?.stripe_status);
        }
      })
      .catch((err) => {
        console.log("connectErr", err);
      });
  };
  useEffect(() => {
    getPayment();
  }, [changePage]);

  return (
    <div className={classNames("py-4")}>
      {tranHistry?.length && tranHistry?.length == viewAll && lastPages != 1 ? (
        <div
          onClick={() => setViewAll(3)}
          className={classNames(styles.back_sub_cont)}
        >
          <BackArrowIcon />
          <label className={classNames(styles.back_sub_title)}>
            Back to Payments
          </label>
        </div>
      ) : (
        <div>
          {cardLoading ? (
            <CardLoader />
          ) : (
            <ManageCard
              list={cardList}
              addCard={handleAddCardModalOpen}
              setCardList={setCardList}
            />
          )}
          <div className={styles.stripe_main_container}>
            <Heading
              title="Stripe Connection"
              headingStyle={classNames(styles.heading, styles.top_margin)}
            />
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between",
                styles.stripe_top_margin
              )}
            >
              <div className={classNames("d-flex")}>
                <StripeIcon />
                <div className={classNames(styles.stripe_container)}>
                  <Heading
                    title="Connect Stripe Account"
                    headingStyle={styles.stripe_heading}
                  />
                  <Title
                    title="Account Connected"
                    titleStyle={styles.stripe_title}
                  />
                </div>
              </div>
              <CustomButton
                title={addCard ? "Connect" : "Remove"}
                loading={stripeLoading}
                containerStyle={
                  addCard ? styles.stripe_add : styles.stripe_remove
                }
                submitHandle={handleDeleteModalOpen}
              />
            </div>
          </div>
        </div>
      )}
      <Heading
        title="Transactions History"
        headingStyle={classNames(styles.heading)}
      />
      {historyLoader ? (
        <TransactionTable
          table_Heading={table_Heading}
          viewAll={viewAll}
          table_data={tranHistry}
          loader={historyLoader}
        />
      ) : tranHistry?.length > 0 ? (
        <TransactionTable
          table_Heading={table_Heading}
          viewAll={viewAll}
          table_data={tranHistry}
          loader={historyLoader}
        />
      ) : (
        <NotRecord />
      )}

      {tranHistry?.length && tranHistry?.length > viewAll ? (
        <div className="d-flex justify-content-center pb-3">
          <CustomButton
            containerStyle={styles.view_button}
            submitHandle={() => {
              setViewAll(tranHistry.length);
            }}
            title="View All"
          />
        </div>
      ) : tranHistry?.length * lastPages > 3 ? (
        <div className={classNames("pb-3")}>
          <Pagination
            listSize={tranHistry?.length}
            page={page}
            setPage={setPage}
            seChngetPage={seChngetPage}
            lastPage={lastPages}
          />
        </div>
      ) : (
        ""
      )}
      <AddCardModal
        show={showAddCardModal}
        handleClose={handleAddCardModalClose}
        handleCardSelect={handleCardSelectModalOpen}
        submitCardTitle={"Add Card"}
        updateListCard={listAllCard}
      />
      <DeleteVideoModal
        show={showDeleteModal}
        handleClose={handleDeleteModalClose}
        handleAction={handleDisconnectStripe}
        loader={disConnectLoading}
        title="You are about to remove your Stripe account."
        Icon={RemoveStripe}
      />
    </div>
  );
}
const ManageCard = ({
  addCard,
  list,
  setCardList,
}: {
  list: any;
  addCard: () => any;
  setCardList: any;
}) => {
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [selectIndx, setSelectIndx] = useState<number>(-1);
  let cardEnum = {
    default: "Set as Default",
    remove: "Remove Card",
  };
  const cardDropAction = (cardItem: string) => {
    if (cardEnum.default === cardItem) {
      let cloneList = [...list];
      let obj = {
        card_id: cloneList[selectIndx]?.id,
      };
      makeDefaultCard(obj)
        .then(({ data }) => {
          let findindx = cloneList.findIndex((ii) => ii.is_default == 1);
          if (findindx > -1) {
            cloneList[findindx].is_default = 0;
          }
          cloneList[selectIndx].is_default = 1;
          setCardList(cloneList);
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else if (cardEnum.remove === cardItem) {
      let cloneList = [...list];
      let obj = {
        card_id: cloneList[selectIndx]?.id,
      };
      removeCard(obj)
        .then(({ data }) => {
          cloneList.splice(selectIndx, 1);
          setCardList(cloneList);
          setSelectIndx(-1);
        })
        .catch((err) => {
          console.log("err", err);
        });

      // cardARR[selectIndx].isActive = false;
    }
  };

  return (
    <div>
      <Heading
        title="Manage your cards"
        headingStyle={classNames(styles.heading)}
      />
      <div
        className={classNames(
          "d-flex flex-wrap justify-content-center justify-content-sm-start",
          styles.top_margin,
          styles.addCard_border
        )}
      >
        {list?.map((item: any, inx: number) => {
          return (
            <>
              <div
                className={classNames(styles.card_item, "mt-2")}
                style={{
                  backgroundImage: `url(${
                    item?.brand !== "Visa" ? YellowCard : purpleCard
                  })`,
                }}
                key={inx}
              >
                <div className="px-4">
                  <div
                    className={classNames(
                      "d-flex justify-content-between align-items-center",
                      styles.card_name_cont
                    )}
                  >
                    <Heading
                      title={item?.name}
                      headingStyle={styles.card_heading}
                    />
                    <div className="d-flex align-items-center">
                      {item.is_default ? (
                        <ActiveCard
                          className={classNames(styles.active_card)}
                        />
                      ) : (
                        ""
                      )}
                      <div
                        className="pointer"
                        onClick={() => {
                          setOpenSelection(!openSelection);
                          setSelectIndx(inx);
                        }}
                      >
                        <MoreIcon className={styles.more} />
                      </div>

                      {openSelection && selectIndx == inx && (
                        <CardDropDown
                          openSelection={openSelection}
                          setOpenSelection={setOpenSelection}
                          cardDropAction={cardDropAction}
                          cardItem={item}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "d-flex justify-content-between align-items-center",
                      styles.card_num_cont
                    )}
                  >
                    <Heading
                      title={`**** **** **** ${item?.last_4}`}
                      headingStyle={styles.card_number}
                    />
                  </div>
                  <div
                    className={classNames(
                      "d-flex align-items-center",
                      styles.card_num_cont
                    )}
                  >
                    <span className={classNames(styles.card_valid)}>
                      Valid Thru
                    </span>
                    <span className={classNames(styles.card_date)}>
                      {item?.exp_month <= 9
                        ? "0" +
                          item?.exp_month +
                          "/" +
                          String(item?.exp_year)?.replace("20", "")
                        : item?.exp_month +
                          "/" +
                          String(item?.exp_year)?.replace("20", "")}
                    </span>
                    {/* {item.date} */}
                  </div>
                </div>
              </div>
            </>
          );
        })}
        {/* ---------------Add Card----------- */}
        {list?.length < 3 ? (
          <div className={classNames(styles.addCard, "mt-2")} onClick={addCard}>
            <div className="d-flex align-items-center">
              <AddCardIcon />
              <Title
                title="Add New Card"
                titleStyle={styles.addCard_label}
                role="button"
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Payment;
