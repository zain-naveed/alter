import { NoContentSearch } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";

const NoContent = () => {
  return (
    <div
      className={classNames(
        "d-flex flex-column justify-content-center  align-items-center w-100",
        styles.fullHeight
      )}
    >
      <NoContentSearch />
      <label className={classNames(styles.noContentTextBold, "mt-3")}>
        Sorry! No Results Found.
      </label>
      <label className={classNames(styles.noContentText)}>
        We are sorry what you were looking for. Please try searching again.
      </label>
    </div>
  );
};

export default NoContent;
