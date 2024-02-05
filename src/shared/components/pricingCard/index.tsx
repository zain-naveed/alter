import { TickIcon, NoContentSearch } from "assets";
import classNames from "classnames";
import NotContents from "shared/default/notContent";
import PricingCardLoader from "shared/components/pricingCardLoader";

import styles from "./style.module.scss";
import { packageConstant, packageTypeConstant } from "shared/utils/constants";
import { useSelector } from "react-redux";

interface PricingPlansProps {
  plans: {
    name: string;
    price: number;
    desc: string;
  }[];
  activePlan: {
    name: string;
    price: number;
    desc: string;
  };
  userId?: string;
  loading: boolean;
  handleActivePlan: (val: {
    name: string;
    price: number;
    desc: string;
  }) => void;
}

interface SinglePlanProps {
  plan: any;
  activePlan: {
    name: string;
    price: number;
    desc: string;
  };
  userId?: string;
  handleActivePlan: (val: {
    name: string;
    price: number;
    desc: string;
  }) => void;
}

const PricingCard = ({
  plans,
  activePlan,
  handleActivePlan,
  loading,
  userId,
}: PricingPlansProps) => {
  return (
    <div
      className={classNames(
        "d-flex flex-column justify-content-between align-items-center w-100"
      )}
    >
      {loading ? (
        <PricingCardLoader />
      ) : plans?.length ? (
        plans?.map((plan, ind) => {
          return (
            <Plan
              plan={plan}
              activePlan={activePlan}
              handleActivePlan={handleActivePlan}
              userId={userId}
              key={ind}
            />
          );
        })
      ) : (
        <NotContents Icon={NoContentSearch} msg="No Packages Found Yet!" />
      )}
    </div>
  );
};

const Plan = ({
  plan,
  activePlan,
  handleActivePlan,
  userId,
}: SinglePlanProps) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  return (
    <div
      className={classNames(
        "d-flex flex-column justify-content-between align-items-center px-3 py-3 position-relative mt-2",
        styles.priceContainer
      )}
      onClick={() => {
        handleActivePlan(plan);
      }}
      style={
        userId === user?.id
          ? {}
          : plan?.id === (activePlan as any)?.id
          ? { borderColor: "#6c5dd3" }
          : {}
      }
    >
      <label className={classNames(styles.title)}>
        {plan?.type == packageConstant.basic
          ? packageTypeConstant.basic
          : plan?.type == packageConstant.standard
          ? packageTypeConstant.standard
          : plan?.type == packageConstant.premium
          ? packageTypeConstant.premium
          : ""}
      </label>

      <div
        className={classNames(
          "d-flex justify-content-between align-items-center w-100"
        )}
      >
        <label className={classNames(styles.desc)}>
          {plan?.type == packageConstant.basic
            ? packageTypeConstant.basicDesc
            : plan?.type == packageConstant.standard
            ? packageTypeConstant.standDesc
            : plan?.type == packageConstant.premium
            ? packageTypeConstant.Premdesc
            : ""}
        </label>
        <label className={classNames(styles.title)}>${plan?.amount}</label>
      </div>
      {userId === user?.id
        ? null
        : plan?.id === (activePlan as any)?.id && (
            <div className={classNames(styles.selectedPlan)}>
              <TickIcon className={styles.tickStyle} />
            </div>
          )}
    </div>
  );
};

export default PricingCard;
