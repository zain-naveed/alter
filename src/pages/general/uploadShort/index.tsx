import classNames from "classnames";
import { Formik } from "formik";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import CustomTextArea from "shared/components/customTextArea";
import Heading from "shared/components/heading";
import UploadShortInput from "shared/components/uploadShortInput";
import ShortSuccess from "shared/modal/shortSuccess";
import { createShortVS, editShortVS } from "shared/utils/validations";
import { uploadShort, updateShorts } from "shared/services/shortService";
import styles from "./style.module.scss";
import { toastMessage } from "shared/components/toast";
import { useSelector } from "react-redux";
interface InitialValues {
  title: string;
  description: string;
  video: any;
}
const UploadShort = () => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const location: any = useLocation();
  const navigate = useNavigate();
  const initialValues: InitialValues = {
    title: location?.state?.title ? location.state.title : "",
    description: location.state?.description ? location.state.description : "",
    video: location.state?.file
      ? location.state.file
      : {
          type: "",
        },
  };
  const [checkEnter, setCheckEnter] = useState<boolean>(true);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const handleModalOpen = () => {
    setSuccessOpen(true);
  };
  const handleModalClose = () => {
    setSuccessOpen(false);
  };

  return (
    <div
      className={classNames(
        styles.container_padding,
        styles.customContainer,
        "text-left"
      )}
    >
      <Heading
        title={location?.state?.isEdit ? "Customize Now" : "What's Hot 🔥"}
        headingStyle={classNames(styles.firstHeading, "mt-3")}
      />
      <Heading
        title={
          location?.state?.isEdit ? "Edit your shorts" : "Upload your shorts"
        }
        headingStyle={classNames(styles.secondHeading, "mt-1 mb-4")}
      />

      <Formik
        initialValues={initialValues}
        onSubmit={(values, action) => {
          setLoader(true);

          action.setSubmitting(true);
          // handleAction(values, action);
          if (location?.state?.isEdit) {
            let obj: any = { ...values };
            obj["id"] = location?.state?.shortId;
            updateShorts(obj)
              .then((res: any) => {
                navigate(`/profile/${user.id}`, {
                  state: {
                    selectType: "Shorts",
                  },
                });
                // navigate(-1);
              })
              .catch((err: any) => {
                toastMessage("Error", err?.response?.data?.message);
              })
              .finally(() => {
                setLoader(false);
                action.setSubmitting(false);
              });
          } else {
            let obj: any = { ...values };
            obj["thumbnail"] = thumbnailFile;
            uploadShort(obj)
              .then(({ data: { data } }) => {
                handleModalOpen();
              })
              .catch((err) => {
                toastMessage("Error", err?.response?.data?.message);
              })
              .finally(() => {
                setLoader(false);
                action.setSubmitting(false);
              });
          }
        }}
        validationSchema={location?.state?.isEdit ? editShortVS : createShortVS}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <>
            <div className={classNames("mb-3")}>
              <UploadShortInput
                formikField={setFieldValue}
                error={touched.video && errors.video ? errors.video : ""}
                isEdit={location?.state?.isEdit}
                // file={location?.state?.isEdit ? location?.state?.file : null}
                preivewThumbnail={location?.state?.thumbnail}
                thumbnail={(thmnbfile: any) => setThumbnailFile(thmnbfile)}
              />
            </div>

            <div className={classNames("mb-4")}>
              <CustomInput
                label="Short Title"
                labelStyle={styles.label}
                disabled={isSubmitting}
                required
                type="text"
                placeholder="Title"
                error={touched.title && errors.title ? errors.title : ""}
                onChange={handleChange("title")}
                padding="10px"
                value={values.title}
              />
            </div>

            <CustomTextArea
              row={4}
              label="Short Description"
              required
              disabled={isSubmitting}
              labelStyle={styles.label}
              error={
                touched.description && errors.description
                  ? errors.description
                  : ""
              }
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  setCheckEnter(false);
                } else {
                  setCheckEnter(true);
                }
              }}
              onChange={(e: any) => {
                if (checkEnter) {
                  setFieldValue("description", e?.target?.value);
                }
              }}
              placeholder="Description"
              padding="5px"
              value={values.description}
            />

            <div className={styles.right}>
              <CustomButton
                title={
                  location?.state?.isEdit ? "Save Changes" : "Upload Video"
                }
                loading={loader}
                isDisable={loader}
                containerStyle={styles.buttonWidth}
                submitHandle={handleSubmit}
              />
            </div>
          </>
        )}
      </Formik>
      <ShortSuccess show={successOpen} handleClose={handleModalClose} />
    </div>
  );
};

export default UploadShort;
