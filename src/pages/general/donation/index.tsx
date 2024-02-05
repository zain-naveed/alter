import React, { useState, useEffect } from "react";
import Pagination from "shared/components/pagination";
import DonationTable from "shared/components/donationTable";
import { table_donation_Heading } from "shared/utils/constants";
import CustomButton from "shared/components/customButton";
import styles from "./style.module.scss";
import { classNames } from "shared/utils/helper";
import { BackArrowIcon, Paypal, RemovePayPal } from "assets";
import Heading from "shared/components/heading";
import Title from "shared/components/title";
import Swtich from "shared/components/switch";
import DeleteVideoModal from "shared/modal/deleteVideo";
import NotRecord from "shared/default/notRecord";
import {
  getDonations,
  connectPaypal,
  removePaypal,
  enbleOrDisbleDonation,
} from "shared/services/settingsService";
import { toastMessage } from "shared/components/toast";
import { setUser } from "shared/redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
interface Props {}

function Donation(props: Props) {
  const {} = props;
  const dispatch = useDispatch();
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const [viewAll, setViewAll] = useState<number>(3);
  const [page, setPage] = useState<number>(1);
  const [cntPayPal, setCntPayPal] = useState<boolean>(
    user?.paypal_email ? true : false
  );
  const [lastPages, setLastPage] = useState<number>(0);
  // const [toggleDonation, setToggleDonation] = useState<boolean>(user?.is_donation_enable ? true: false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [changePage, seChngetPage] = useState<number>(1);
  const [historyLoader, setHistoryLoader] = useState<boolean>(false);
  const [donationHistry, setDotnHistory] = useState([]);
  const [pEmail, setPEmail] = useState("");
  const [pload, setPload] = useState<boolean>(false);

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setPload(true);
    removePaypalAccount();
  };
  const emailValidation = (mail: string) => {
    if (mail === "") {
      toastMessage("error", "Email is required!");
      return false;
    } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      toastMessage("error", "Invalid Email");
      return false;
    } else {
      return true;
    }
  };
  const handleDeleteModalOpen = () => {
    if (!cntPayPal) {
      const checkValidatity = emailValidation(pEmail);
      if (checkValidatity) {
        savePaypal();
      }
    } else {
      setShowDeleteModal(true);
    }
  };
  const savePaypal = () => {
    setPload(true);
    connectPaypal({ paypal_email: pEmail })
      .then(({ data: { data } }) => {
        let cloneUser = { ...user };
        cloneUser.paypal_email = data.user.paypal_email;
        let resp = {
          isLoggedIn: true,
          user: cloneUser,
        };
        dispatch(setUser(resp));
        setCntPayPal(!cntPayPal);
        toastMessage("success", "PayPal Email Connect Successfully!");
        setPEmail("");
      })
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => setPload(false));
  };
  const removePaypalAccount = () => {
    removePaypal()
      .then(({ data: { data, message } }) => {
        let cloneUser = { ...user };
        cloneUser.paypal_email = null;
        let resp = {
          isLoggedIn: true,
          user: cloneUser,
        };
        dispatch(setUser(resp));
        toastMessage("success", message);
        setCntPayPal(false);
      })
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => setPload(false));
  };
  useEffect(() => {
    setHistoryLoader(true);
    let queryPage = `?page=${changePage}`;
    getDonations(10, queryPage)
      .then(({ data: { data } }) => {
        setLastPage(data?.last_page);
        setDotnHistory(data?.donations);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setHistoryLoader(false);
      });
  }, [changePage]);
  const togglerDonation = () => {
    enbleOrDisbleDonation()
      .then(({ data: { data } }) => {
        let cloneUser = { ...user };
        cloneUser.is_donation_enable = data.isDonationEnable;
        let resp = {
          isLoggedIn: true,
          user: cloneUser,
        };
        dispatch(setUser(resp));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="py-4">
      {donationHistry?.length == viewAll && lastPages != 1 ? (
        <div
          onClick={() => setViewAll(3)}
          className={classNames(styles.back_sub_cont)}
        >
          <BackArrowIcon />
          <label className={classNames(styles.back_sub_title)}>
            Back to Donations
          </label>
        </div>
      ) : (
        <>
          <div>
            <div className={styles.stripe_main_container}>
              <Heading
                title="Paypal Connection"
                headingStyle={classNames(styles.heading)}
              />
              <div
                className={classNames(
                  styles.stripe_top_margin,
                  styles.main_cont
                )}
              >
                <div className={classNames("d-flex")}>
                  <Paypal />
                  <div className={classNames(styles.stripe_container)}>
                    <Heading
                      title="Connect Paypal Account"
                      headingStyle={styles.stripe_heading}
                    />
                    <Title
                      title="Connect your Paypal account in order to receive donations from global streamers."
                      titleStyle={styles.stripe_title}
                    />
                  </div>
                </div>
                <div className={styles.d_input_cont}>
                  <div
                    className={classNames(
                      styles.d_child_cont,
                      cntPayPal ? styles.d_child_cont_cond : ""
                    )}
                  >
                    <input
                      placeholder="Enter your email to connect"
                      value={pEmail}
                      onChange={(e) => setPEmail(e.target.value)}
                      className={classNames(
                        styles.d_input,
                        cntPayPal ? styles.d_input_cond : ""
                      )}
                    />
                    <CustomButton
                      title={cntPayPal ? "Remove" : "continue"}
                      submitHandle={handleDeleteModalOpen}
                      containerStyle={
                        cntPayPal ? styles.d_input_btn_cond : styles.d_input_btn
                      }
                      loading={cntPayPal ? false : pload}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              "d-flex justify-content-between align-items-center",
              styles.disable_don
            )}
          >
            <div className={styles.notification_container}>
              <Heading
                title="Enable/Disable Donations"
                headingStyle={classNames(
                  styles.donation_heading,
                  styles.top_margin
                )}
              />
              <Title
                title="Manage if you want to recieve donations from Streamers or not."
                titleStyle={styles.donation_title}
              />
            </div>
            <Swtich
              toggleDonation={!!user?.is_donation_enable}
              handleChange={() => togglerDonation()}
            />
          </div>
        </>
      )}
      <Heading
        title="Payment History"
        headingStyle={classNames(styles.heading)}
      />
      {historyLoader ? (
        <DonationTable
          table_Heading={table_donation_Heading}
          viewAll={viewAll}
          table_data={donationHistry}
          loader={historyLoader}
        />
      ) : donationHistry.length > 0 ? (
        <DonationTable
          table_Heading={table_donation_Heading}
          viewAll={viewAll}
          table_data={donationHistry}
          loader={historyLoader}
        />
      ) : (
        <NotRecord />
      )}

      {donationHistry.length > viewAll ? (
        <div className="d-flex justify-content-center">
          <CustomButton
            containerStyle={styles.view_button}
            submitHandle={() => {
              setViewAll(donationHistry.length);
            }}
            title="View All"
          />
        </div>
      ) : donationHistry.length * lastPages > 3 ? (
        <Pagination
          page={page}
          setPage={setPage}
          listSize={donationHistry?.length}
          lastPage={lastPages}
          seChngetPage={seChngetPage}
        />
      ) : (
        ""
      )}
      <DeleteVideoModal
        show={showDeleteModal}
        handleClose={handleDeleteModalClose}
        title="You are about to remove your Paypal account."
        loader={pload}
        Icon={RemovePayPal}
      />
    </div>
  );
}

export default Donation;
