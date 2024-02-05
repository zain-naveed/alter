import { useState } from "react";
import { classNames, isNumberCheck } from "shared/utils/helper";
import styles from "./style.module.scss";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  required: boolean;
  error: string;
  labelStyle: any;
  padding: any;
  onFieldChange: (key: string, val: string) => void;
}

const CustomCardNumberInput = ({
  label,
  required,
  error,
  value,
  placeholder,
  type,
  onFieldChange,
  labelStyle,
  padding,
}: Partial<InputProps>) => {
  const [keyPress, setKeyPress] = useState("");
  const [isNumber, setIsNumber] = useState<boolean>(false);
  function myKeyPress(e: any) {
    setKeyPress(e.code);
    if (e.code === "Backspace") {
      setIsNumber(true);
    } else {
      setIsNumber(isNumberCheck(e));
    }
  }

  const cardInputHandler = (text: string) => {
    if (isNumber) {
      if (text.length < 20) {
        let formattedNumber = text;
        if (keyPress !== "Backspace") {
          if (text.length === 4 || text.length === 9) {
            formattedNumber = formattedNumber + "-";
          } else if (text.length === 5 && text[4] !== "-") {
            formattedNumber = text.slice(0, 4) + "-" + text.slice(4);
          } else if (text.length === 10 && text[9] !== "-") {
            formattedNumber = text.slice(0, 9) + "-" + text.slice(9);
          } else if (text.length === 15 && text[14] !== "-") {
            formattedNumber = text.slice(0, 14) + "-" + text.slice(14);
          }
        }
        onFieldChange?.("number", formattedNumber);
      }
    }
  };

  return (
    <div
      className={classNames("position-relative w-100", error ? "mb-1" : "mb-3")}
    >
      <div className="d-flex flex-column">
        <label
          className={`${styles.inputLabel} ${labelStyle ? labelStyle : ""}`}
        >
          {label} {!!required && <label className={styles.asterik}>*</label>}
        </label>
        <div className={`${styles.inputContainer}`}>
          <input
            type={type}
            placeholder={placeholder}
            className={`${styles.inputStyle}`}
            value={value}
            onChange={(e) => cardInputHandler(e.target.value)}
            style={padding ? { padding: padding } : {}}
            onKeyDown={myKeyPress}
          />
        </div>
      </div>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CustomCardNumberInput;
