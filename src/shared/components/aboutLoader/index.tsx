import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

const AboutLoader = () => {
  return (
    <div
      className={classNames(
        "my-2 my-sm-4 d-flex flex-column align-items-start align-self-start w-100"
      )}
    >
      <BoxLoader iconStyle={classNames(styles.aboutText, "w-75")} />
      <BoxLoader iconStyle={classNames(styles.aboutText, "w-50 mt-2")} />
      <BoxLoader iconStyle={classNames(styles.aboutText, "w-25 mt-2")} />
    </div>
  );
};

export default AboutLoader;
