import { CrossArrowIcon, MediaIcon } from "assets";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
// import ReactCrop, { Crop } from "react-image-crop";
import Cropper from "react-easy-crop";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import { toastMessage } from "shared/components/toast";
import { setUser } from "shared/redux/reducers/userSlice";
import { EditCoverPhoto } from "shared/services/settingsService";
import { classNames } from "shared/utils/helper";
import getCroppedImg from "./cropImage";
import "./cropper.css";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  coverPic: string;
  setSaveCoverPic: any;
}

function CropperModal(props: ModalProps) {
  const { user } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const { show, handleClose, coverPic, setSaveCoverPic } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [slider, setSlider] = useState<number>(0);
  const [ImageCrop, setImageCrop] = useState("");
  const [ImageCropFile, setImageCropFile] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    // @ts-ignore
    if (document.getElementById("myinput")) {
      // @ts-ignore
      document.getElementById("myinput").oninput = function () {
        // @ts-ignore
        var value = ((this.value - this.min) / (this.max - this.min)) * 100;
        // @ts-ignore
        this.style.background =
          "linear-gradient(to right, #ff754c 0%, #ff754c " +
          value +
          "%, #F0F3F6 " +
          value +
          "%, #F0F3F6 100%)";
      };
    }
  });

  const CROP_AREA_ASPECT = 2.5 / 1;
  const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    if (coverPic) {
      let imgFile = await getCroppedImg(coverPic, croppedAreaPixels);
      setImageCropFile(imgFile);
      let imgUrl = URL.createObjectURL(imgFile);
      setImageCrop(imgUrl);
    }
  };

  const saveCrop = () => {
    setSaveCoverPic(ImageCrop);
    setLoading(true);
    let formData = new FormData();
    formData.append("cover_photo", ImageCropFile);
    EditCoverPhoto(formData)
      .then((res) => {
        if (res?.data?.status) {
          let userObj = {
            ...res?.data?.data?.user,
            token: user?.user?.token,
          };
          let resp = {
            user: userObj,
            isLoggedIn: true,
          };
          dispatch(setUser(resp));
          toastMessage("success", "Cover Photo Updated");
          handleClose();
        } else {
          toastMessage("Error", res.data.message);
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
        toastMessage("Error", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          <div
            className={classNames("container", styles.main_container)}
            id="main"
          >
            <CrossArrowIcon className={styles.cross} onClick={handleClose} />
            <div className={classNames(styles.heading_margin)}>
              <Heading
                title="Your Cover Photo"
                headingStyle={classNames(styles.heading)}
              />
            </div>
            <Cropper
              image={coverPic}
              aspect={CROP_AREA_ASPECT}
              crop={crop}
              zoom={zoom}
              onCropChange={(size) => {
                console.log("Crop", size);
                setCrop(size);
              }}
              onZoomChange={(size) => {
                console.log("Zoom", size);
                setZoom(size);
              }}
              showGrid={false}
              onCropComplete={onCropComplete}
              onCropAreaChange={(croppedArea) => {
                setCroppedArea(croppedArea);
              }}
              cropShape={"rect"}
              objectFit="contain"
            />
            <div className="d-flex justify-content-center px-4 my-2">
              <div className="d-flex align-items-center">
                <MediaIcon className={styles.small_icon} />
                <input
                  id="myinput"
                  min="1"
                  step={0.5}
                  max="60"
                  onChange={(e: any) => {
                    if (e.target.value !== 0) {
                      setZoom(e.target.value);
                      setSlider(e.target.value);
                      setCrop({ x: -e.target.value, y: -e.target.value });
                    } else {
                      setZoom(1);
                    }
                  }}
                  type="range"
                  value={slider}
                />
                <MediaIcon className={styles.large_icon} />
              </div>
            </div>
            <div className={classNames("d-flex justify-content-end mt-3")}>
              <div className="d-flex">
                <CustomButton
                  title="Cancel"
                  submitHandle={handleClose}
                  containerStyle={styles.cancel}
                />
                <CustomButton
                  title="Save"
                  submitHandle={saveCrop}
                  containerStyle={styles.save}
                  loading={loading}
                  isDisable={loading}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CropperModal;
