import { NoCommentIcon } from "assets";
import { useState, useEffect } from "react";
import CommentCard from "shared/components/commentCard";
import CommentInput from "shared/components/commentInput";
import CustomSelect from "shared/components/customSelect";
import Heading from "shared/components/heading";
import { CommentFilters } from "shared/utils/constants";
import { classNames } from "shared/utils/helper";
import { useParams } from "react-router";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import {
  addShortComment,
  getShortComment,
  updateShortComment,
  delShortComment,
} from "shared/services/shortService";
import CommentLoader from "../commentLoader/commentLoader";
import { getStreamComment } from "shared/services/streamService";
import DonationCommentCard from "../donationCommentCard";

interface CommentSectionProps {
  isStream: any;
  userId: any;
  isSubscriber: boolean;
}
function CommentSection({
  isStream,
  userId,
  isSubscriber,
}: Partial<CommentSectionProps>) {
  const param = useParams();
  const {
    user: { user, guest },
  } = useSelector((state: any) => state.root);
  const [Loading, setLoading] = useState<boolean>(false);
  const [comntList, setCmntList] = useState<any>([]);
  const [addLoader, setAddLoader] = useState<boolean>(false);
  const [streamsFilter, setStreamsFilter] = useState<string>(
    CommentFilters[0].label
  );
  const [inputMsg, setInputMsg] = useState<string>("");
  const [selectComment, setSelectComment] = useState<any>(null);
  const handleSubmit = () => {
    let obj = {
      short_id: param.id,
      content: inputMsg,
      type: "0",
    };

    if (selectComment?.id) {
      setAddLoader(true);
      updateComment();
    } else {
      setAddLoader(true);
      addShortComment(obj)
        .then(({ data: { data, status } }) => {
          if (status) {
            let cloneComment = [...comntList];
            cloneComment.push(data.shortComment);
            setCmntList(cloneComment);
            setInputMsg("");
            // @ts-ignore
            let inputContainer =
              window.document.getElementById("commentInput")?.innerText;
            inputContainer = "";
            // @ts-ignore
            window.document.getElementById("commentInput").innerText =
              inputContainer;
          }
          let filval: any = CommentFilters.filter(
            (ii) => ii.label == streamsFilter
          );
          commentList(filval[0].value);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setAddLoader(false);
        });
    }
  };
  const updateComment = () => {
    let updateObj = {
      id: selectComment?.id,
      content: inputMsg,
      type: "0",
    };
    updateShortComment(updateObj)
      .then(({ data: { data, status } }) => {
        if (status) {
          let cloneComment = [...comntList];
          let findIndx = cloneComment.findIndex(
            (ii) => ii.id == selectComment?.id
          );
          if (findIndx > -1) {
            cloneComment[findIndx].content = inputMsg;
            setCmntList(cloneComment);
          }
          setInputMsg("");
          setSelectComment(null);
          // @ts-ignore
          let inputContainer =
            window.document.getElementById("commentInput")?.innerText;
          inputContainer = "";
          // @ts-ignore
          window.document.getElementById("commentInput").innerText =
            inputContainer;
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setAddLoader(false));
  };
  const commentList = (query: string) => {
    if (isStream) {
      getStreamComment(`${param.id}/${query}`)
        .then(({ data: { data, status } }) => {
          if (status) {
            setCmntList(data?.stream_comments);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      getShortComment(`${param.id}/40/${query}`)
        .then(({ data: { data, status } }) => {
          if (status) {
            setCmntList(data?.shortComments);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    setLoading(true);
    setCmntList([]);
    commentList(streamsFilter);
  }, [param.id, isSubscriber]);

  let cardEnum = {
    Edit: "Edit",
    remove: "Delete",
  };
  const commentAction = (val: string) => {
    if (cardEnum.Edit == val) {
      // @ts-ignore
      let inputContainer =
        window.document.getElementById("commentInput")?.innerText;
      inputContainer = selectComment?.content;
      // @ts-ignore
      window.document.getElementById("commentInput").innerText = inputContainer;
      setInputMsg(selectComment?.content);
    } else if (cardEnum.remove == val) {
      let obj = {
        id: selectComment?.id,
      };
      delShortComment(obj)
        .then(({ data }) => {
          let cloneComment = [...comntList];
          let findIndx = cloneComment.findIndex(
            (ii) => ii.id == selectComment?.id
          );
          if (findIndx > -1) {
            cloneComment.splice(findIndx, 1);
            setCmntList(cloneComment);
          }
          setSelectComment(null);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className={classNames(styles.commentHeader, "p-3")}>
        <Heading title="Comments" headingStyle={styles.headingStyle} />
        <div className={classNames(styles.filter_Container)}>
          <CustomSelect
            options={CommentFilters}
            selectionColor={"#808191"}
            containerStyle={styles.selectionStyle}
            inputContainerStyle={styles.inputContainer}
            iconStyle={styles.iconStyle}
            value={streamsFilter}
            onChangeHandle={(val) => {
              setLoading(true);
              commentList(val);

              let filval = CommentFilters.filter((ii) => ii.value == val);
              setStreamsFilter(filval[0].label);
            }}
          />
        </div>
      </div>
      <div
        className={classNames(
          styles.comment_list_container,
          "px-sm-3 px-2  align-items-center d-flex flex-column",
          comntList?.length > 0
            ? "justify-content-start"
            : "justify-content-center"
        )}
      >
        {Loading ? (
          Array.from(Array(4).keys()).map((item: any, inx: number) => {
            return <CommentLoader key={inx} />;
          })
        ) : comntList?.length > 0 ? (
          comntList.map((item: any, inx: number) => {
            return item?.type === 1 ? (
              <DonationCommentCard
                isInLiveStream={false}
                isStream={isStream}
                item={item}
                key={inx}
                index={inx}
              />
            ) : (
              <CommentCard
                item={item}
                key={inx}
                index={inx}
                setSelectComment={setSelectComment}
                commentAction={commentAction}
                isOwn={userId === item?.user?.id}
                streamUserId={userId}
                isStream={isStream}
              />
            );
          })
        ) : (
          <div
            className={classNames(
              "d-flex flex-column justify-content-center align-items-center"
            )}
          >
            <NoCommentIcon />
            <label className={classNames(styles.noCommentTitle)}>
              No Comments Yet.
            </label>
            <label className={classNames(styles.noCommentSubTitle)}>
              Be the first to share what you think.
            </label>
          </div>
        )}
      </div>
      {user?.token && !isStream && !guest ? (
        <div className={classNames("p-3")}>
          <CommentInput
            loading={addLoader}
            submitButton={handleSubmit}
            onChange={(val: string) => {
              // if(val == ""){
              //   setSelectComment(null)
              // }
              setInputMsg(val);
            }}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default CommentSection;
