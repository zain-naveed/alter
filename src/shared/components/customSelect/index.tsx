import { ChevDownIcon } from "assets";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

interface InputProps {
  label: string;
  required: boolean;
  error: string;
  value: string;
  onChangeHandle: (val: string | any) => void;
  containerStyle: any;
  selectionColor: string;
  options: { value: string; label: string }[];
  iconStyle: any;
  inputContainerStyle: any;
  placeholder: string;
  optionsContainer: any;
  disabled:boolean;
}

const CustomSelect = ({
  disabled,
  label,
  required,
  error,
  value,
  onChangeHandle,
  containerStyle,
  selectionColor,
  options,
  iconStyle,
  inputContainerStyle,
  placeholder,
  optionsContainer,
}: Partial<InputProps>) => {
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  function handleClick(e: any) {
    const elem: any = document.getElementById("optionsContainer");
    if (!elem?.contains(e.target)) {
      setOpenSelection(false);
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

  return (
    <div className="position-relative" role={"button"}>
      <div className="d-flex flex-column">
        {label && (
          <label className={styles.inputLabel}>
            {label} {!!required && <label className={styles.asterik}>*</label>}
          </label>
        )}
        <div
          className={
            inputContainerStyle ? inputContainerStyle : styles.inputContainer
          }
          onClick={() => {
            if(!disabled){
              setOpenSelection(!openSelection);
              setTimeout(() => {
                document.body.addEventListener(
                  "click",
                  (event: any) => {
                    handleClick(event);
                  },
                  true
                );
              }, 200);

            }
           
          }}
        >
          <label
            role={"button"}
            className={`${
              containerStyle ? containerStyle : styles.selectionStyle
            }`}
            style={
              value === "" && !disabled ? { color: "#808191" } : value !== "" && disabled ? { color: "#808191" }   : { color: selectionColor }
            }
          >
            {value !== "" ? value : placeholder}
          </label>
          <ChevDownIcon className={iconStyle && iconStyle} />
        </div>
      </div>
      <div
        className={`${
          optionsContainer ? optionsContainer : styles.optionsContainer
        }`}
        style={openSelection ? { display: "flex" } : { display: "none" }}
        id="optionsContainer"
      >
        {options?.map((opt, ind) => {
          return (
            <label
              onClick={() => {
                onChangeHandle?.(opt?.value);
                document.body.removeEventListener(
                  "click",
                  (event: any) => {
                    handleClick(event);
                  },
                  true
                );
                setOpenSelection(false);
              }}
              key={ind}
              className={`${styles.optionLabel} p-3`}
              style={
                ind === options?.length - 1
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
              {opt?.label}
            </label>
          );
        })}
      </div>
      {!!error && <div className="error">{error}</div>}
    </div>
  );
};

export default CustomSelect;
