import { CrossArrowIcon } from "assets";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import PricingCard from "shared/components/pricingCard";
import { toastMessage } from "shared/components/toast";
import { getStreamerPackages } from "shared/services/packageService";
import {
  packageConstant,
  packageTypeConstant,
  plans,
} from "shared/utils/constants";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  isChange: boolean;
  plan: string;
  show: boolean;
  user: any;
  setSelectPlan?: any;
  selectPlan: any;
  planLoader?: boolean;
  handleClose: () => void;
  handleCardSelect: () => void;
  navgiateType?: string;
  submit?: () => void;
}

function PaymentPlansModal({
  isChange,
  plan,
  show,
  user,
  handleClose,
  handleCardSelect,
  setSelectPlan,
  selectPlan,
  planLoader,
  navgiateType,
  submit,
}: Partial<ModalProps>) {
  const [activePlan, setActivePlan] = useState<any>({
    name: "",
    price: plans[0].price,
    desc: plans[0].desc,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [packageList, setpackageList] = useState<any>([]);
  const handleActivePlan = (val: {
    name: string;
    price: number;
    desc: string;
  }) => {
    if (setSelectPlan) {
      setSelectPlan(val);
    }

    setActivePlan(val);
  };

  const renderPriceDesc = () => {
    if ((activePlan as any)?.type == packageConstant.basic) {
      return "month";
    } else if ((activePlan as any)?.type == packageConstant.standard) {
      return "6 months";
    } else if ((activePlan as any)?.type == packageConstant.premium) {
      return "12 months";
    }
    return "";
  };

  const renderPriceDuration = () => {
    if ((activePlan as any)?.type == packageConstant.basic) {
      return "monthly";
    } else if ((activePlan as any)?.type == packageConstant.standard) {
      return "every 6 months";
    } else if ((activePlan as any)?.type == packageConstant.premium) {
      return "every 12 months";
    }
    return "";
  };

  useEffect(() => {
    getPackages(user?.id);
  }, []);
  const getPackages = (userId: any) => {
    setLoading(true);
    getStreamerPackages(userId)
      .then(
        ({
          data: {
            data: { packages, active_package_type },
          },
        }) => {
          if (active_package_type != null) {
            let isActivePackage = Number(active_package_type);
            let selectedPackage = packages.find(
              (ii: any) => ii?.type == isActivePackage
            );
            setActivePlan(selectedPackage);
            if (setSelectPlan) {
              setSelectPlan(selectedPackage);
            }
          }

          setpackageList(packages);
        }
      )
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setLoading(false));
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
          <div className={styles.header}>
            <CrossArrowIcon className={styles.pointer} onClick={handleClose} />
          </div>
          <div className={classNames(styles.container)}>
            <Heading
              title={
                isChange
                  ? "Change Pricing Plan"
                  : `To view the stream, subscribe now!`
              }
              headingStyle={styles.headingStyle}
            />
            <label className={classNames(styles.subtitle, "mt-2")}>
              {isChange
                ? "Upgrade your plan to enjoy streams for longer time."
                : "To watch stream you’ll need to pay a little amount. Choose pricing plan that is suitable for you."}
            </label>
            <br />
            <div
              className={classNames(
                "d-flex justify-content-center align-items-center py-3 w-100"
              )}
            >
              <PricingCard
                plans={packageList}
                activePlan={activePlan}
                handleActivePlan={handleActivePlan}
                loading={loading}
              />
            </div>
            {packageList?.length ? (
              <div
                className={classNames(
                  "d-flex justify-content-between align-items-center"
                )}
              >
                <div
                  className={classNames(
                    "d-flex justify-content-center align-items-center"
                  )}
                >
                  {activePlan?.id && (
                    <>
                      <label className={classNames(styles.activePrice)}>
                        ${activePlan?.amount}
                      </label>
                      <label
                        className={classNames(styles.activeDesc, "mt-2 ms-1")}
                      >
                        /{renderPriceDesc()}{" "}
                        {`(billed ${renderPriceDuration()})`}
                      </label>
                    </>
                  )}
                </div>

                <CustomButton
                  title="Choose Plan"
                  loading={planLoader}
                  isDisable={planLoader}
                  containerStyle={classNames(styles.choosebtnStyle)}
                  submitHandle={() => {
                    if (activePlan?.id) {
                      if (navgiateType) {
                        submit?.();
                      } else {
                        handleClose?.();
                        handleCardSelect?.();
                      }
                    } else {
                      toastMessage("error", "Please Select a Plan");
                    }
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PaymentPlansModal;
