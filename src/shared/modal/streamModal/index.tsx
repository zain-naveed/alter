import { CrossArrowIcon, TickIcon } from "assets";
import { Formik } from "formik";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import CustomTextArea from "shared/components/customTextArea";
import Heading from "shared/components/heading";
import StreamThumbnail from "shared/components/StreamThumbnail";
import { setStream } from "shared/redux/reducers/streamSlice";
import { classNames } from "shared/utils/helper";
import { streamThumbnailVS } from "shared/utils/validations";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  preivewModal: () => void;
}
interface intiabValue {
  streamTitle: string;
  description: string;
  thumbnail: any;
  disableComment: boolean;
}

function StreamModal({ show, handleClose, preivewModal }: ModalProps) {
  const { stream } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const [files, setFile] = useState<any>(
    stream?.thumbnail ? stream?.thumbnail : null
  );
  let initValue: intiabValue = {
    streamTitle: stream?.streamTitle ? stream?.streamTitle : "",
    description: stream?.description ? stream?.description : "",
    thumbnail: stream?.thumbnail
      ? stream?.thumbnail
      : {
          type: "",
        },
    disableComment: stream?.disableComment ? stream?.disableComment : false,
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
              handleClose();
              preivewModal();
              dispatch(setStream({ ...values, isStarted: false }));
            }}
            validationSchema={streamThumbnailVS}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
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

                <label className={styles.label}>
                  Streaming Thumbnail{" "}
                  <label className={styles.asterik}>*</label>
                </label>
                <StreamThumbnail
                  setFile={setFile}
                  formikField={setFieldValue}
                  error={
                    touched.thumbnail && errors.thumbnail
                      ? errors.thumbnail
                      : ""
                  }
                />
                <div
                  className="d-flex align-items-center mb-4"
                  onClick={() => {
                    setFieldValue("disableComment", !values?.disableComment);
                  }}
                  role={"button"}
                >
                  <div
                    className={` me-1 d-flex justify-content-center align-items-center ${
                      values?.disableComment
                        ? styles.termsCheckBoxActive
                        : styles.termsCheckBox
                    }`}
                    role={"button"}
                  >
                    <TickIcon />
                  </div>
                  <label className={styles.disableText} role={"button"}>
                    Disable Comments
                  </label>
                </div>
                <CustomButton
                  title="Start Stream"
                  submitHandle={() => handleSubmit()}
                />
              </div>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default StreamModal;
