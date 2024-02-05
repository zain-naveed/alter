import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

const ShortCardLoader = () => {
  return (
    <div className={`m-2`}>
      <div className="d-flex flex-sm-row flex-column p-0 m-0 align-items-center justify-content-between px-4 pt-3">
        <div className={classNames("w-100")}>
          <BoxLoader iconStyle={classNames(styles.videoStyle)} />
        </div>
        <div
          className={classNames(
            "d-flex flex-row flex-sm-column justify-content-end align-self-end align-items-center ms-0 ms-sm-4 mb-1 mt-3 mt-sm-0"
          )}
        >
          <div className="d-flex flex-column align-items-center me-3 me-sm-0  mb-0  mb-sm-2 mb-md-3">
            <BoxLoader iconStyle={classNames(styles.inActivebtnStyle)} />
            <BoxLoader iconStyle={classNames(styles.btnCount, "mt-1")} />
          </div>
          <div className="d-flex flex-column align-items-center me-3 me-sm-0   mb-0  mb-sm-2 mb-md-3">
            <BoxLoader iconStyle={classNames(styles.inActivebtnStyle)} />
            <BoxLoader iconStyle={classNames(styles.btnCount, "mt-1")} />
          </div>
          <div className="d-flex flex-column align-items-center me-3 me-sm-0   mb-0  mb-sm-2 mb-md-3">
            <BoxLoader iconStyle={classNames(styles.inActivebtnStyle)} />
            <BoxLoader iconStyle={classNames(styles.btnCount, "mt-1")} />
          </div>
          <div className="d-flex flex-column align-items-center">
            <BoxLoader iconStyle={classNames(styles.inActivebtnStyle)} />
            <BoxLoader iconStyle={classNames(styles.btnCount, "mt-1")} />
          </div>
        </div>
      </div>
      <div className="row p-0 mb-3 px-4">
        <div className="col-12 col-sm-11 px-md-3 px-1 pt-sm-3 pt-1 d-flex align-items-start justify-content-start">
          <div className="col-1 d-flex justify-content-center">
            <div className={`position-relative ${styles.userIconContainer} `}>
              <BoxLoader iconStyle={classNames(styles.userIcon)} />
            </div>
          </div>

          <div className="d-flex flex-column justify-content-center align-items-start col-11">
            <BoxLoader iconStyle={classNames(styles.userTitle, "mt-1")} />
            <BoxLoader iconStyle={classNames(styles.streamTitle, "my-3")} />
            <BoxLoader iconStyle={classNames(styles.streamDesc)} />
            <BoxLoader iconStyle={classNames(styles.streamDesc2, "mt-1")} />
          </div>
        </div>
      </div>
      <div
        className={`${styles.shortContainer} ms-lg-3 ms-md-2 ms-sm-1 ms-0`}
      />
    </div>
  );
};

export default ShortCardLoader;
