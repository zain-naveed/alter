import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

const PricingCardLoader = () => {
  return (
    <div
      className={classNames(
        "d-flex flex-column justify-content-between align-items-center w-100"
      )}
    >
      <BoxLoader iconStyle={classNames(styles.priceContainer)} />
      <BoxLoader iconStyle={classNames(styles.priceContainer, "mt-2")} />
      <BoxLoader iconStyle={classNames(styles.priceContainer, "mt-2")} />
    </div>
  );
};

export default PricingCardLoader;
