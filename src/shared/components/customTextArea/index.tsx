import styles from "./style.module.scss";
import React, { useState } from 'react'
interface InputProps extends React.HTMLProps<HTMLTextAreaElement> {
  label: string;
  required: boolean;
  error: string;
  labelStyle: any;
  row: number;
  padding: any;
}

const CustomTextArea = ({
  label,
  required,
  error,
  value,
  placeholder,
  onChange,
  labelStyle,
  row,
  padding,
  onKeyDown,
  disabled
}: Partial<InputProps>) => {
  return (
    <div className="position-relative mb-3 w-100">
      <div className="d-flex flex-column">
        <label
          className={`${styles.inputLabel} ${labelStyle ? labelStyle : ""}`}
        >
          {label} {!!required && <label className={styles.asterik}>*</label>}
        </label>
        <div className={`${styles.inputContainer}`}>
          <textarea
            rows={row}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            className={`${styles.inputStyle}`}
            value={value}
            disabled={disabled}
            onChange={onChange}
            style={padding ? { padding: padding } : {}}
          />
        </div>
      </div>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CustomTextArea;
