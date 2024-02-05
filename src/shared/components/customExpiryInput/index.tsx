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

const CustomExpiryInput = ({
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

  const expiryHandler = (text: string) => {
    if (isNumber) {
      if (text.length < 6) {
        let formattedtext = text;
        if (keyPress !== "Backspace") {
          if (text.length === 2) {
            formattedtext = formattedtext + "/";
          } else if (text.length === 3 && text[2] !== "/") {
            formattedtext = text.slice(0, 2) + "/" + text.slice(2);
          }
        }
        onFieldChange?.("expiry", formattedtext);
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
            onChange={(e) => expiryHandler(e.target.value)}
            style={padding ? { padding: padding } : {}}
            onKeyDown={myKeyPress}
          />
        </div>
      </div>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CustomExpiryInput;
