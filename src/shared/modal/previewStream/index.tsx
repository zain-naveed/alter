import { EditPreviewIcon } from "assets";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Title from "shared/components/title";
import { routeConstant } from "shared/routes/routeConstant";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  streamModal: () => void;
}

function PreviewStream(props: ModalProps) {
  const { stream } = useSelector((state: any) => state.root);
  const naviagte = useNavigate();
  let thumnailUrl = stream?.thumbnail;
  if (thumnailUrl) {
    thumnailUrl = URL.createObjectURL(stream?.thumbnail);
  }
  const { show, handleClose, streamModal } = props;
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
          <Header close={handleClose} showStreamModal={streamModal} />
          <div className={classNames("container p-1", styles.container)}>
            <img src={thumnailUrl} className={styles.img} alt="preview" />
            <div className={styles.content_stream}>
              <StreamTitle title="Stream Title" />
              <Space>
                <Heading
                  title={stream?.streamTitle}
                  headingStyle={styles.headingStyle}
                />
              </Space>
              <div className="mt-4" />
              <StreamTitle title="Stream Description" />
              <Space>
                <div className={styles.description}>{stream?.description}</div>
              </Space>
              <div className="mt-4" />
              <CustomButton
                title="Continue"
                submitHandle={() => {
                  handleClose();
                  naviagte(routeConstant.streamDashBoard.path);
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
const Header = ({ close, showStreamModal }: any) => {
  return (
    <div className={styles.header_icon}>
      <EditPreviewIcon
        className={classNames(styles.share_icon, "mx-2")}
        onClick={() => {
          close();
          showStreamModal();
        }}
      />
    </div>
  );
};
const StreamTitle = ({ title }: { title: string }) => {
  return (
    <>
      <Title title={title} titleStyle={styles.titleStyle} />
      <label className={styles.asterik}>*</label>
    </>
  );
};
const Space = ({ children }: any) => {
  return <div className={styles.margin_vertical}>{children}</div>;
};
export default PreviewStream;
