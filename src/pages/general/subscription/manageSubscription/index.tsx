import { DollarIcon } from "assets";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/customButton";
import { toastMessage } from "shared/components/toast";
import { addSubscriptoin } from "shared/services/settingsService";
import { classNames } from "shared/utils/helper";
import { subPriceVS } from "shared/utils/validations";
import styles from "../style.module.scss";
let subList = [
  {
    planType: "Basic Plan",
    pType: 0,
    duration: "(for 1 month)",
  },
  {
    planType: "Standard Plan",
    pType: 1,
    duration: "(for 6 months)",
  },
  {
    planType: "Premium Plan",
    pType: 2,
    duration: "(for 12 months)",
  },
];
interface InitialValues {
  subPrice: string;
  adminFee: boolean;
}

function ManageSubscription({ pkgList }: { pkgList: any[] }) {
  const [activePlan, setActivePlan] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValues] = useState<InitialValues>({
    subPrice: "",
    adminFee: false,
  });
  useEffect(() => {
    if (pkgList?.length) {
      setInitialValues({
        ...initialValue,
        subPrice: pkgList.find((ii) => ii.type === 0)
          ? String(pkgList.find((ii) => ii.type === 0).amount)
          : "",
      });
    }
  }, [pkgList?.length]);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValue}
        onSubmit={(values, action) => {
          let obj = {
            package_type: activePlan,
            amount: values.subPrice,
          };
          setLoading(true);
          addSubscriptoin(obj)
            .then(({ data: { data, message } }) => {
              if (data?.subscription_price == "no_stripe_account") {
                toastMessage("error", message);
              } else {
                setActivePlan(0);
                action.resetForm();
                toastMessage("success", message);
              }
            })
            .catch((err) => {
              toastMessage("Error", err?.response?.data?.message);
            })
            .finally(() => setLoading(false));
        }}
        validationSchema={subPriceVS}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <>
            <div className={classNames(styles.sub_margin)}>
              <div className={classNames("row", styles.subscription_row)}>
                {subList.map((subItem, inx) => {
                  return (
                    <div className="col-12 col-sm-4" key={inx}>
                      <div
                        className={classNames(
                          "d-flex align-items-center",
                          inx === subList.length - 1
                            ? styles.subscriptionItem
                            : ""
                        )}
                      >
                        <SubRadio
                          {...subItem}
                          activePlan={activePlan}
                          setActivePlan={setActivePlan}
                          setFieldValue={setFieldValue}
                          pkgs={pkgList}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className={classNames(styles.price_margin)}
            >
              <label className={styles.price_label}>
                Set Pricing <span className={styles.label_required}>*</span>
              </label>

              <div
                className={classNames(
                  "d-flex align-items-center",
                  styles.input_container
                )}
              >
                <span>
                  <DollarIcon />
                </span>
                <input
                  type={"number"}
                  value={values.subPrice}
                  onChange={handleChange("subPrice")}
                  placeholder="12"
                />
              </div>
              {
                <div className={classNames(styles.error, "my-2")}>
                  {touched.subPrice && errors.subPrice ? errors.subPrice : ""}
                </div>
              }
              <div className={classNames("d-flex", styles.adminFee)}>
                <label className="container-abc">
                  <input
                    checked={values.adminFee}
                    onChange={() => setFieldValue("adminFee", !values.adminFee)}
                    type="checkbox"
                    required={true}
                    id="check"
                  />
                  <span className="checkmark"></span>
                </label>
                <label htmlFor="check" className={styles.checkbox_label}>
                  I acknowledge that 5% will be deducted from admin.
                </label>
              </div>
              <div className={styles.error}>
                {(touched as any).adminFee && errors?.adminFee
                  ? errors?.adminFee
                  : ""}
              </div>
            </form>
            <div
              className={classNames(
                "d-flex justify-content-end",
                styles.button_container
              )}
            >
              <div className="d-flex">
                <CustomButton title="Cancel" containerStyle={styles.cancel} />
                <CustomButton
                  title="Save Change"
                  loading={loading}
                  isDisable={loading}
                  submitHandle={handleSubmit}
                  containerStyle={styles.save}
                />
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
const SubRadio = ({
  pType,
  planType,
  duration,
  activePlan,
  setActivePlan,
  setFieldValue,
  pkgs,
}: {
  pType: number;
  planType: string;
  duration: string;
  activePlan: any;
  setFieldValue: any;
  pkgs: any[];
  setActivePlan: (val: number) => void;
}) => {
  return (
    <>
      <input
        type={"radio"}
        name="sub"
        id="sub"
        onClick={() => {
          if (pkgs.length) {
            let selectPackage = pkgs.find((ii) => ii.type === pType);

            if (selectPackage) {
              setFieldValue("subPrice", selectPackage?.amount);
            } else {
              setFieldValue("subPrice", "");
            }
          }

          setActivePlan(pType);
        }}
        checked={pType === activePlan}
      />
      <label htmlFor="sub" className={styles.radio_label}>
        {planType} <span className={styles.sub_duration}>{duration}</span>
      </label>
    </>
  );
};

export default ManageSubscription;
