import React from "react";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";
interface Props {}

function CardLoader(props: Props) {
  const {} = props;

  return (
    <>
      <div
        className={classNames(
          "d-flex flex-wrap justify-content-center justify-content-sm-start",
          styles.top_margin,
          styles.addCard_border
        )}
      >
        {["", "", ""]?.map((item: any, inx: number) => {
          return (
            <>
              <div className={classNames(styles.card_item_loader, "mt-2")}>
                <div className={classNames(styles.card_item, "mt-2")}>
                  <BoxLoader />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default CardLoader;
