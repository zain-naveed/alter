import { CloseIcon, UploadIcon } from "assets";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Progress from "shared/components/progress";
import Title from "shared/components/title";
import { checkVideoType } from "shared/utils/helper";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";
import VideoThumbnail from "react-video-thumbnail";
import "./thumbnail.css";
interface Props {
  setFile: (val: any) => void;
  formikField: any;
  error: any;
  isEdit: boolean;
  file: any;
  thumbnail: any;
  preivewThumbnail: any;
}
function UploadShortInput({
  setFile,
  formikField,
  error,
  isEdit,
  file,
  thumbnail,
  preivewThumbnail,
}: Partial<Props>) {
  const [fileUrl, setFileUrl] = useState<any>(file ? file : "");
  const [progressState, setProgressValue] = useState<number>(0);
  const progress = useRef<number>(0);

  const onDrop = useCallback((acceptedFiles: any) => {
    let getFile: any = acceptedFiles[0];

    if (checkVideoType(getFile.type)) {
      let vid = document.createElement("video");
      let fileURL = URL.createObjectURL(getFile);
      vid.src = fileURL;
      vid.ondurationchange = function () {
        // @ts-ignore
        if (this.duration <= 31) {
          formikField("video", getFile);
          if (getFile) {
            setFile?.(getFile);
            setFileUrl(URL.createObjectURL(getFile));
            var inter = setInterval(() => {
              // setProgressValue(progress + 10);
              progress.current = progress.current + 10;
              setProgressValue(progress.current);
              if (progress.current === 100) {
                clearInterval(inter);
              }
            }, 100);
          }
        } else {
          toastMessage("error", "Maximum Short duration is 30s");
        }
      };
    } else {
      setFile?.(null);
      setFileUrl("");
      formikField("video", { type: "" });
      toastMessage("error", "File not supported");
    }
    // eslint-disable-next-line
  }, []);

  const localFileToFileObj = async (fl: any) => {
    let response = await fetch(file);
    let data = await response.blob();
    let metadata = {
      type: "video/mp4",
    };
    return new File([data], "gg.mp4", metadata);
  };

  const fileHandle = async () => {
    let res = await localFileToFileObj(file);
    setFileUrl(file);
    progress.current = 100;
    setProgressValue(progress?.current);
    formikField("video", res);
  };

  useEffect(() => {
    if (file) {
      fileHandle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dataURLtoFile = (dataurl: string, filename: string) => {
    var arr: any = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  return (fileUrl && progressState === 100) || preivewThumbnail ? (
    <div className={classNames("position-relative", styles.video_height)}>
      {!isEdit && (
        <CustomButton
          Icon={CloseIcon}
          containerStyle={styles.crossIconStyle}
          iconStyle={styles.btnIconStyle}
          submitHandle={() => {
            progress.current = 0;
            setProgressValue(0);
            setFile?.(null);
            setFileUrl(null);
            formikField("video", { type: "" });
          }}
        />
      )}
      {fileUrl ? (
        <VideoThumbnail
          videoUrl={fileUrl}
          thumbnailHandler={(thumbnal: any) => {
            let getFile = dataURLtoFile(thumbnal, "a.png");
            thumbnail(getFile);
          }}
          snapshotAtTime={5}
        />
      ) : (
        ""
      )}
      {isEdit ? (
        <img
          src={preivewThumbnail}
          className={classNames(styles.shortVideoEdit)}
        />
      ) : (
        <video
          src={fileUrl}
          disablePictureInPicture
          controlsList="nodownload noremoteplayback noplaybackrate foobar"
          className={classNames(styles.shortVideo)}
          controls
        />
      )}
    </div>
  ) : (
    <>
      <input
        type={"file"}
        id="file"
        {...getInputProps()}
        style={{ display: "none" }}
        accept="video/*"
      />
      <label
        className={styles.short_container}
        {...getRootProps({
          onClick: (e) => e.stopPropagation(),
        })}
        htmlFor="file"
      >
        <div className={styles.short_upload_container}>
          <Heading
            title="Drag and drop video file"
            headingStyle={styles.headingStyle}
          />
          <Title
            title="Upload your shorts here and let it go viral"
            titleStyle={styles.titleStyle}
          />
          <div className={classNames(styles.upload_short)} role={"button"}>
            <UploadIcon className={classNames(styles.icon)} /> Or choose file
          </div>
        </div>
        <div className={styles.progress_container}>
          <Progress value={progressState} />

          <Title title="File Size 40MB" titleStyle={styles.titleStyle} />
        </div>
      </label>
      {<div className={styles.error}>{error ? error : ""}</div>}
    </>
  );
}

export default UploadShortInput;
