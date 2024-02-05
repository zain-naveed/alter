import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";
const CardLoaders = () => {
  return (
    <>
      {["", "", ""].map((res, indx: number) => {
        return (
          <div
            key={`card-${indx}`}
            className={classNames(styles.cardContainerLoader)}
          >
            <BoxLoader iconStyle={styles.cardLoaderItem} />
          </div>
        );
      })}
    </>
  );
};
export default CardLoaders;
