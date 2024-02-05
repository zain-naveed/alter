import { EyeIcon, HideEyeIcon, LockIcon } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";
import { useRef } from "react";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  required: boolean;
  password: boolean;
  setShowPassword: (val: boolean) => void | any;
  error: string;
  showPassword: boolean;
  isDate: boolean;
  labelStyle: any;
  padding: any;
}

const CustomInput = ({
  label,
  required,
  password,
  setShowPassword,
  error,
  value,
  placeholder,
  type,
  showPassword,
  onChange,
  isDate,
  labelStyle,
  padding,
  disabled,
}: Partial<InputProps>) => {
  const dateRef: any = useRef(null);
  // var today = new Date().toISOString().split('T')[0];
  const d = new Date();
  const maxDate = new Date(d.getFullYear() - 10, d.getMonth(), d.getDate())
    .toISOString()
    .split("T")[0];
  return (
    <div
      className={classNames("position-relative w-100", error ? "mb-1" : "mb-3")}
    >
      <div className={classNames("d-flex flex-column")}>
        <label
          className={`${styles.inputLabel} ${labelStyle ? labelStyle : ""}`}
        >
          {label} {!!required && <label className={styles.asterik}>*</label>}
        </label>
        <div className={`${styles.inputContainer}`}>
          {!!password && <LockIcon />}
          {!!isDate ? (
            <>
              <div className={`${styles.dateInputToggle}`}>
                <label
                  htmlFor="dateInput"
                  role={"button"}
                  className={`${styles.dateInputToggleButton}`}
                />
                <input
                  type={type}
                  id="dateInput"
                  name="dateInput"
                  disabled={disabled}
                  placeholder={placeholder}
                  className={`${styles.dateInputStyle}`}
                  value={value}
                  ref={dateRef}
                  onChange={onChange}
                  max={maxDate}
                />
              </div>
              <input
                type={"text"}
                disabled={disabled}                
                placeholder={placeholder}
                className={`${styles.date_disable_cursor} ${styles.inputStyle} ${styles.dateInputTextStyle}`}
                value={value}
                onClick={() => {
                  dateRef.current.showPicker();
                }}
              />
            </>
          ) : (
            <input
              disabled={disabled}
              type={type}
              placeholder={placeholder}
              className={`${styles.inputStyle}`}
              value={value}
              onChange={onChange}
              style={padding ? { padding: padding } : {}}
            />
          )}
          {!!password &&
            (!showPassword ? (
              <EyeIcon
                role={"button"}
                onClick={() => {
                  setShowPassword?.(true);
                }}
              />
            ) : (
              <HideEyeIcon
                role={"button"}
                onClick={() => {
                  setShowPassword?.(false);
                }}
              />
            ))}
        </div>
      </div>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CustomInput;
