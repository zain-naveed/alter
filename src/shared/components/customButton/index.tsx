import { Spinner } from "react-bootstrap";
import styles from "./style.module.scss";

interface BtnProps {
  title: string;
  submitHandle: () => void;
  Icon: any;
  containerStyle: any;
  iconStyle: any;
  isDisable: boolean;
  loading: boolean;
  spinnerColor: string;
}

const CustomButton = ({
  title,
  submitHandle,
  Icon,
  containerStyle,
  iconStyle,
  isDisable,
  loading,
  spinnerColor,
}: Partial<BtnProps>) => {
  return (
    <button
      className={` ${
        containerStyle ? containerStyle : styles.customBtnContainer
      }`}
      onClick={submitHandle}
      disabled={isDisable}
    >
      {loading ? (
        <Spinner
          size="sm"
          animation="border"
          style={{ color: spinnerColor ? spinnerColor : "white" }}
        />
      ) : (
        <>
          {Icon && <Icon className={iconStyle && iconStyle} />}
          {title && title}
        </>
      )}
    </button>
  );
};

export default CustomButton;
