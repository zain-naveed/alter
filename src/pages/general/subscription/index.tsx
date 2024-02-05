import { BackArrowIcon } from "assets";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Pagination from "shared/components/pagination";
import SubscriptionTable from "shared/components/subscriptionTable";
import { toastMessage } from "shared/components/toast";
import NotRecord from "shared/default/notRecord";
import CancelSubscription from "shared/modal/cancelSubscription";
import DetailsModal from "shared/modal/details";
import PaymentPlansModal from "shared/modal/paymentPlans";
import {
  cancelSubscription,
  getStreamerPackages,
  subscribePackage,
} from "shared/services/packageService";
import { listAllSubscription } from "shared/services/settingsService";
import { table_Heading } from "shared/utils/constants";
import { classNames } from "shared/utils/helper";
import "./checkbox.css";
import ManageSubscription from "./manageSubscription";
import styles from "./style.module.scss";
import tableStyle from "./table.module.scss";
function Subscription() {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const [viewAll, setViewAll] = useState<number>(3);
  const [lastPages, setLastPage] = useState<number>(0);
  const [selectPlan, setSelectPlan] = useState<any>(null);
  const [planLoader, setPlanLoader] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [changePage, seChngetPage] = useState<number>(1);
  const [actionType, setActionType] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [historyLoader, setHistoryLoader] = useState<boolean>(false);
  const [subHistry, setSubHistory] = useState([]);
  const [pkgList, setPkgList] = useState([]);
  const [cancelSubLoad, setCanSubLoad] = useState<boolean>(false);
  const [showUnSubscribeModal, setShowUnSubscribeModal] =
    useState<boolean>(false);

  const handleDetailsModalOpen = () => {
    setShowDetailsModal(true);
  };
  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
  };
  const handlePaymentModalOpen = () => {
    setShowPaymentModal(true);
  };
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };
  const handleUnSubscribeModalOpen = () => {
    setShowUnSubscribeModal(true);
  };
  const handleUnSubscribeModalClose = () => {
    setShowUnSubscribeModal(false);
  };
  useEffect(() => {
    getAllSubscription();
  }, [changePage]);
  useEffect(() => {
    getPackages();
  }, []);
  const getAllSubscription = () => {
    setHistoryLoader(true);
    listAllSubscription(page)
      .then(({ data: { data } }) => {
        setLastPage(data?.last_page);
        setSubHistory(data?.transaction);
      })
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => setHistoryLoader(false));
  };

  let modalEnum = {
    view: "view",
    edit: "edit",
    cancel: "cancel",
  };
  const handleSelect = (item: any, type: string) => {
    if (modalEnum.view == type) {
      handleDetailsModalOpen();
    } else if (modalEnum.edit == type) {
      handlePaymentModalOpen();
    } else {
      handleUnSubscribeModalOpen();
    }

    setSelectedItem(item);
    setActionType(type);
  };
  const handleSubmit = () => {
    setPlanLoader(true);
    let obj = {
      type: (selectPlan as any)?.type,
      to_user_id: (selectPlan as any)?.user_id,
    };
    subscribePackage(obj)
      .then(({ data }) => {
        if (data?.data?.is_subscribed) {
          handlePaymentModalClose();
          getAllSubscription();
        } else {
          toastMessage("error", data?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setPlanLoader(false));
  };
  const handleCancelSubscription = () => {
    setCanSubLoad(true);
    let obj = {
      subscription_id: selectedItem?.transaction_id,
    };
    cancelSubscription(obj)
      .then(({ data: { data, message } }) => {
        if (data?.is_cancel) {
          getAllSubscription();
          handleUnSubscribeModalClose();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setCanSubLoad(false));
  };
  const getPackages = () => {
    getStreamerPackages(user?.id)
      .then(
        ({
          data: {
            data: { packages, active_package_type },
          },
        }) => {
          setPkgList(packages);
        }
      )
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <>
      <div className={classNames("py-4")}>
        {subHistry?.length > viewAll || subHistry?.length <= 3 ? (
          <div
            className={classNames(
              "text-start",
              styles.subscriptoin_first_container,
              "mb-3"
            )}
          >
            <Heading
              title="Manage subscriptions for others"
              headingStyle={classNames(styles.heading)}
            />
            <ManageSubscription pkgList={pkgList} />
          </div>
        ) : (
          ""
        )}

        <div className={classNames("text-start")}>
          {subHistry?.length === viewAll && lastPages != 1 ? (
            <div
              onClick={() => setViewAll(3)}
              className={classNames(tableStyle.back_sub_cont)}
            >
              <BackArrowIcon />
              <label className={classNames(tableStyle.back_sub_title)}>
                Back to Manage Subscriptions
              </label>
            </div>
          ) : (
            ""
          )}

          <Heading
            title="My Subscriptions"
            headingStyle={classNames(styles.heading)}
          />
          {historyLoader ? (
            <SubscriptionTable
              table_Heading={table_Heading}
              viewAll={viewAll}
              table_data={subHistry}
              loader={historyLoader}
            />
          ) : subHistry?.length ? (
            <SubscriptionTable
              table_Heading={table_Heading}
              viewAll={viewAll}
              table_data={subHistry}
              loader={historyLoader}
              actionButton={(response: any) => {
                handleSelect(response.item, response.type);
              }}
            />
          ) : (
            <NotRecord />
          )}

          {subHistry && subHistry?.length > viewAll ? (
            <div className="d-flex justify-content-center">
              <CustomButton
                containerStyle={tableStyle.view_button}
                submitHandle={() => {
                  setViewAll(subHistry.length);
                }}
                title="View All"
              />
            </div>
          ) : subHistry?.length * lastPages > 3 ? (
            <Pagination
              seChngetPage={seChngetPage}
              lastPage={lastPages}
              listSize={subHistry.length}
              page={page}
              setPage={setPage}
            />
          ) : (
            ""
          )}
        </div>
        <DetailsModal
          title="Subscription Details"
          isTransaction={false}
          show={showDetailsModal}
          handleClose={handleDetailsModalClose}
          handleChangePlan={handlePaymentModalOpen}
          handleUnSubscribe={handleUnSubscribeModalOpen}
          item={selectedItem}
        />
        {showPaymentModal ? (
          <PaymentPlansModal
            isChange={true}
            plan={selectedItem?.plan}
            selectPlan={selectPlan}
            setSelectPlan={setSelectPlan}
            user={{ id: selectedItem?.user_id }}
            planLoader={planLoader}
            show={showPaymentModal}
            navgiateType="Setting"
            submit={handleSubmit}
            handleClose={() => {
              handlePaymentModalClose();
              if (actionType === "view") {
                handleDetailsModalOpen();
              }
            }}
          />
        ) : (
          ""
        )}

        <CancelSubscription
          show={showUnSubscribeModal}
          handleClose={handleUnSubscribeModalClose}
          handleSubmit={handleCancelSubscription}
          loader={cancelSubLoad}
          handleBack={actionType === "view" ? handleDetailsModalOpen : () => {}}
        />
      </div>
    </>
  );
}

export default Subscription;
