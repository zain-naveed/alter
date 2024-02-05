import { SendIcon } from "assets";
import { Spinner } from "react-bootstrap";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface Props {
  submitButton: () => void;
  onChange: any;
  loading: boolean;
}

function CommentInput(props: Partial<Props>) {
  const { submitButton, onChange, loading } = props;

  return (
    <div className={classNames(styles.input_wrapper)}>
      <div className={classNames(styles.input_container)}>
        <div className={classNames(styles.input_sub_container)}>
          <div
            className={classNames(styles.input)}
            placeholder={"Write Your Comment"}
            contentEditable={!loading}
            id="commentInput"
            onInput={(e) => onChange(e.currentTarget.textContent)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitButton?.();
              }
            }}
          />
        </div>

        <button onClick={submitButton} className={classNames(styles.send)}>
          {loading ? (
            <Spinner
              animation="border"
              size="sm"
              style={{ color: "#6c5dd3" }}
            />
          ) : (
            <SendIcon />
          )}
        </button>
      </div>
    </div>
  );
}

export default CommentInput;
