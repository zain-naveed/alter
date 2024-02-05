import classNames from "classnames";
import React, { useRef } from "react";
import { useEffect } from "react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./style.scss";

interface InputProps {
  label: string;
  required: boolean;
  error: string;
  value: string;
  disable: boolean;
  onChange: (key: string, val: string | any) => void;
}

const CustomPhoneInput = ({
  label,
  required,
  error,
  value,
  disable,
  onChange,
}: Partial<InputProps>) => {
  const phoneMaxRef = useRef("");
  const dropIconAdder = () => {
    let parentNodes = document.getElementsByClassName(
      "PhoneInputCountrySelectArrow"
    );
    parentNodes[0].innerHTML = `<img src=${
      require("../../../assets/icons/fill-down.svg").default
    } />`;
  };

  useEffect(() => {
    dropIconAdder();
  }, []);

  return (
    <>
      <div
        className={classNames(
          "position-relative w-100",
          error ? "mb-1" : "mb-3"
        )}
      >
        <div className="d-flex flex-column">
          <label className={`inputLabel`}>
            {label} {!!required && <label className={`asterik`}>*</label>}
          </label>

          <div className={`${`inputContainer`}`}>
            <PhoneInput
              disabled={disable}
              // international={true}
              defaultCountry="DE"
              placeholder="+1 (111)11-111-111"
              value={value}
              onChange={(value) => {
                onChange?.("phonenumber", value);
              }}
              limitMaxLength={true}
            />
          </div>
        </div>
        {!!error && <div className="error">{error}</div>}
      </div>
    </>
  );
};

export default CustomPhoneInput;
