import React, { useEffect, useState } from "react";
import PricingCard from "shared/components/pricingCard";
import CustomButton from "shared/components/customButton";
import { classNames } from "shared/utils/helper";
import {
  getStreamerPackages,
  subscribePackage,
} from "shared/services/packageService";
import { toastMessage } from "shared/components/toast";
import { tabEnum } from "../constant";
interface Props {
  activeTab: string;
  id: any;
  reloadPage: () => void;
}

function ProfilePrice(props: Props) {
  const { activeTab, id, reloadPage } = props;
  const [activePlan, setActivePlan] = useState<{
    name: string;
    price: number;
    desc: string;
  }>({ name: "", price: 0, desc: "" });
  const [pkgList, setPkgList] = useState([]);
  const [pkgloading, setPkgLoading] = useState(false);
  const [alrdyPlan, setAlreadyPlan]: any = useState(null);
  const [subscrbeloading, setSubscrbeLoading] = useState(false);
  const handleActivePlan = (val: {
    name: string;
    price: number;
    desc: string;
  }) => {
    setActivePlan(val);
  };
  useEffect(() => {
    getPackages(id);
  }, []);
  const getPackages = (userId: any) => {
    setPkgLoading(true);
    getStreamerPackages(userId)
      .then(
        ({
          data: {
            data: { packages, active_package_type },
          },
        }) => {
          if (active_package_type != null) {
            setAlreadyPlan(Number(active_package_type));
            let isActivePackage = Number(active_package_type);
            let selectedPackage = packages.find(
              (ii: any) => ii?.type == isActivePackage
            );
            setActivePlan(selectedPackage);
          }

          setPkgList(packages);
        }
      )
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
      })
      .finally(() => setPkgLoading(false));
  };
  const subscbePackage = () => {
    if ((activePlan as any)?.stripe_package_id) {
      setSubscrbeLoading(true);
      let obj = {
        type: (activePlan as any)?.type,
        to_user_id: id,
      };
      subscribePackage(obj)
        .then(({ data }) => {
          if (data?.data?.is_subscribed) {
            reloadPage();
            toastMessage("success", "Package Subscribe Successfully!");
          } else {
            toastMessage("error", data?.message);
          }
        })
        .catch((err) => {
          console.log("Error", err?.response?.data?.message);
        })
        .finally(() => setSubscrbeLoading(false));
    } else {
      toastMessage("error", "Please Select Package!");
    }
  };

  return (
    <>
      <PricingCard
        plans={pkgList}
        activePlan={activePlan}
        handleActivePlan={handleActivePlan}
        loading={pkgloading}
        userId={id}
      />
      {tabEnum.myPlan !== activeTab && pkgList?.length ? (
        <div
          className={classNames("mt-4  align-self-end")}
          style={
            activePlan.name === "" ? { width: "270px" } : { width: "173px" }
          }
        >
          <CustomButton
            submitHandle={subscbePackage}
            loading={subscrbeloading}
            isDisable={subscrbeloading}
            title={
              activePlan.name === ""
                ? "Choose a Plan & Subscribe"
                : alrdyPlan != null
                ? "Change Plan"
                : "Save"
            }
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default ProfilePrice;
