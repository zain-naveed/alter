import { UploadIcon } from "assets";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { checkFileType, classNames } from "shared/utils/helper";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";
interface Props {
  setFile: (val: any) => void;
  formikField?: any;
  error?: string;
}

const StreamThumbnail = (props: Props) => {
  // eslint-disable-next-line
  const { stream } = useSelector((state: any) => state.root);
  const { setFile, formikField, error } = props;
  const [fileUrl, setFileUrl] = useState<any>("");
  let obj = useRef({});
  const onDrop = useCallback((acceptedFiles: any) => {
    let getFile: any = acceptedFiles[0];
    if (checkFileType(getFile.type)) {
      formikField("thumbnail", getFile);
      if (getFile) {
        setFile(getFile);
        setFileUrl(URL.createObjectURL(getFile));
      }
    } else {
      setFile(null);
      setFileUrl("");
      formikField("thumbnail", { type: "" });
      toastMessage("error", "Only JPG, JPEG, PNG are supported");
    }
    // eslint-disable-next-line
  }, []);
  // eslint-disable-next-line
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (stream?.thumbnail) {
      setFileUrl(URL.createObjectURL(stream?.thumbnail));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (fileUrl) {
    obj.current = { backgroundImage: `url(${fileUrl})` };
  }

  return (
    <div>
      <input
        type={"file"}
        id="file"
        {...getInputProps()}
        style={{ display: "none" }}
      />
      <label
        style={obj.current}
        className={classNames(styles.stream_container, styles.preview)}
        {...getRootProps({
          onClick: (e)=>e.stopPropagation()
        })}
        htmlFor="file"
        role={"button"}
      >
        <div className={styles.stream_head_title}>
          {!fileUrl ? (
            <>
              {" "}
              Drag your image here or{" "}
              <span className={styles.blue}>browse</span>
            </>
          ) : (
            <UploadIcon />
          )}
        </div>
        <div
          className={classNames(
            styles.stream_type,
            fileUrl ? styles.white : ""
          )}
        >
          Supports JPG, JPEG or PNG only
        </div>
      </label>
      {<div className={styles.error}>{error ? error : ""}</div>}
    </div>
  );
};

export default StreamThumbnail;
