import { CrossArrowIcon } from "assets";
import { Formik } from "formik";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import CustomTextArea from "shared/components/customTextArea";
import Heading from "shared/components/heading";
import { toastMessage } from "shared/components/toast";
import { updateStream } from "shared/services/streamService";
import { classNames } from "shared/utils/helper";
import { editStreamVS } from "shared/utils/validations";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  desc?: string;
  id?: string;
  setTitle: (val: string) => void;
  setDescription: (val: string) => void;
}
interface InitialValues {
  streamTitle: string;
  description: string;
}

function EditStream({
  show,
  handleClose,
  title,
  desc,
  id,
  setTitle,
  setDescription,
}: ModalProps) {
  // eslint-disable-next-line
  let initValue: InitialValues = {
    streamTitle: title,
    description: desc ? desc : "",
  };

  const handleEditStream = (values: InitialValues, action: any) => {
    let formData = new FormData();
    formData.append("id", id ? id : "");
    formData.append("title", values.streamTitle);
    formData.append("description", values.description);
    updateStream(formData)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          setTitle(values.streamTitle);
          setDescription(values.description);
          handleClose();
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
        toastMessage("Error", err.response.data.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        contentClassName={styles.modalContent}
      >
        <Modal.Body className={styles.modalContent}>
          <div className={styles.header}>
            <CrossArrowIcon className={styles.pointer} onClick={handleClose} />
          </div>
          <Formik
            initialValues={initValue}
            onSubmit={(values, action) => {
              action.setSubmitting(true);
              handleEditStream(values, action);
            }}
            validationSchema={editStreamVS}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
            }: any) => (
              <div className={classNames("container", styles.container)}>
                <div className={styles.heading_margin}>
                  <Heading
                    title="Streaming Details"
                    headingStyle={styles.headingStyle}
                  />
                </div>
                <CustomInput
                  label="Stream Title"
                  placeholder="Title"
                  value={values.streamTitle}
                  onChange={handleChange("streamTitle")}
                  required
                  error={
                    touched.streamTitle && errors.streamTitle
                      ? errors.streamTitle
                      : ""
                  }
                />
                <CustomTextArea
                  label="Description"
                  row={5}
                  placeholder="Description"
                  required
                  value={values.description}
                  onChange={handleChange("description")}
                  error={
                    touched.description && errors.description
                      ? errors.description
                      : ""
                  }
                />

                <CustomButton
                  title="Save Changes"
                  submitHandle={() => handleSubmit()}
                  isDisable={isSubmitting}
                  loading={isSubmitting}
                />
              </div>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditStream;
