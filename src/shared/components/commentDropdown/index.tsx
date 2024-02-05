import classNames from "classnames";
import { useEffect } from "react";
import { cmntDropDownOptions } from "shared/utils/constants";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";

interface CommentDropDownProps {
  setSelectComment: (val: any) => void;
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  cmntDropAction: (val: string) => void;
  isOwn: any;
  streamerId: string;
}

const CommentDropDown = ({
  setSelectComment,
  openSelection,
  setOpenSelection,
  isOwn,
  streamerId,
  cmntDropAction,
}: Partial<CommentDropDownProps>) => {
  const { user } = useSelector((state: any) => state.root);
  function handleClick(e: any) {
    const elem: any = document.getElementById("profileDropDownContainer");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection?.(false);
        setSelectComment?.(null);
      }
    }
  }
  useEffect(() => {
    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleClick(event);
      },
      true
    );
    // eslint-disable-next-lines
  }, []);
  let filterdArr = cmntDropDownOptions?.filter((ii) =>
    !isOwn && streamerId == user?.user?.id ? ii.cmntTitle != "Edit" : ii
  );

  return (
    <div
      className={`${styles.optionsContainer}`}
      style={openSelection ? { display: "flex" } : { display: "none" }}
      id="profileDropDownContainer"
      role={"button"}
    >
      {filterdArr?.map((opt, ind) => {
        return (
          <div
            onClick={() => {
              document.body.removeEventListener(
                "click",
                (event: any) => {
                  handleClick(event);
                },
                true
              );
              setOpenSelection?.(false);
              cmntDropAction?.(opt.cmntTitle);
            }}
            key={ind}
            className={`${styles.optionContainer} py-3`}
            style={
              filterdArr.length < 2
                ? {
                    borderBottomColor: "transparent",
                    borderBottomRightRadius: "14px",
                    borderBottomLeftRadius: "14px",
                  }
                : ind === cmntDropDownOptions?.length - 1
                ? {
                    borderBottomColor: "transparent",
                    borderBottomRightRadius: "14px",
                    borderBottomLeftRadius: "14px",
                  }
                : ind === 0
                ? {
                    borderBottomColor: "#E4E4E4",
                    borderTopRightRadius: "14px",
                    borderTopLeftRadius: "14px",
                  }
                : { borderBottomColor: "#E4E4E4" }
            }
          >
            <label
              className={classNames(styles.optionLabel, "me-3")}
              style={opt?.cmntTitle === "Delete" ? { color: "#ff754c" } : {}}
            >
              {opt?.cmntTitle}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default CommentDropDown;
