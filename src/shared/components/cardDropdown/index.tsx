import classNames from "classnames";
import { useEffect } from "react";
import { cardDropDownOptions } from "shared/utils/constants";
import styles from "./style.module.scss";

interface ProfileDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  cardDropAction: (val: string) => void;
  cardItem:any;
}

const CardDropDown = ({
  openSelection,
  setOpenSelection,
  cardDropAction,
  cardItem
}: ProfileDropDownProps) => {
  function handleClick(e: any) {
    const elem: any = document.getElementById("profileDropDownContainer");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection(false);
      }
    }
  }
  useEffect(() => {
    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleClick(event);
      },
      true
    );
    // eslint-disable-next-lines
  }, []);

  return (
    <div
      className={`${styles.optionsContainer}`}
      style={openSelection ? { display: "flex" } : { display: "none" }}
      id="profileDropDownContainer"
      role={"button"}
    >
      {cardDropDownOptions?.filter((ii)=> cardItem?.is_default ? ii.cardTitle != "Set as Default":ii )?.map((opt, ind) => {
        return (
          
          <div
            onClick={() => {
              document.body.removeEventListener(
                "click",
                (event: any) => {
                  handleClick(event);
                },
                true
              );
              setOpenSelection(false);
              cardDropAction(opt.cardTitle);
            }}
            key={ind}
            className={`${styles.optionContainer} py-3`}
            style={
              ind === cardDropDownOptions?.length - 1
                ? {
                    borderBottomColor: "transparent",
                    borderBottomRightRadius: "14px",
                    borderBottomLeftRadius: "14px",
                  }
                : ind === 0
                ? {
                    borderBottomColor: "#E4E4E4",
                    borderTopRightRadius: "14px",
                    borderTopLeftRadius: "14px",
                  }
                : { borderBottomColor: "#E4E4E4" }
            }
          >
            
                <label
              className={classNames(styles.optionLabel, "me-3")}
              style={
                opt?.cardTitle === "Remove Card" ? { color: "#ff754c" } : {}
              }
            >
              {opt?.cardTitle}
            </label>
            
            
          </div>
        );
      })}
    </div>
  );
};

export default CardDropDown;
