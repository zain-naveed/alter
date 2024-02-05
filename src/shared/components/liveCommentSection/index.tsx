import { NoCommentIcon } from "assets";
import { useState, useEffect, useRef } from "react";
import CommentCard from "shared/components/commentCard";
import CommentInput from "shared/components/commentInput";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import CommentLoader from "../commentLoader/commentLoader";
import { getStreamComment } from "shared/services/streamService";
import { socket } from "shared/services/socketService";
import DonationCommentCard from "../donationCommentCard";

interface CommentSectionProps {
  commentListContainer: any;
  isSubscriber: boolean;
  streamUserId: number;
  id: any;
}
function LiveCommentSection({
  commentListContainer,
  isSubscriber,
  streamUserId,
  id,
}: Partial<CommentSectionProps>) {
  const {
    user: { user, guest },
  } = useSelector((state: any) => state.root);
  const [Loading, setLoading] = useState<boolean>(false);
  const [comntList, setCmntList] = useState<any>([]);
  const commntListRef = useRef<any>([]);
  const [inputMsg, setInputMsg] = useState<string>("");
  const handleSubmit = () => {
    if (inputMsg !== "") {
      let filterMsg = inputMsg.replace(`"`, `''`);
      filterMsg = filterMsg.replace(`"`, "''");
      let obj = {
        stream_id: id,
        content: filterMsg,
        user_id: user?.id,
        type: "create",
        selection: "0",
        is_star: false,
        streamer_id: streamUserId,
      };
      if (isSubscriber) {
        obj.is_star = true;
      }
      console.log("obj", obj, "isSub", isSubscriber);
      socket.emit("comment_action", obj);
      setInputMsg("");
      let inputContainer =
        window.document.getElementById("commentInput")?.innerText;
      inputContainer = "";
      // @ts-ignore
      window.document.getElementById("commentInput").innerText = inputContainer;
    }
  };
  const commentList = () => {
    getStreamComment(`${id}/oldest-first`)
      .then(({ data: { data, status } }) => {
        if (status) {
          setCmntList(data?.stream_comments);
          commntListRef.current = data?.stream_comments;
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCommentListSocket = (data: any) => {
    let resp = {
      stream_id: data?.stream_id,
      content: data?.content,
      created_at: data?.created_at,
      comment_id: data?.comment_id,
      user: {
        id: data?.user_id,
        first_name: data?.first_name,
        last_name: data?.last_name,
        avatar: data?.avatar,
        base_url: data?.base_url,
        social_login_id: data?.social_login_id,
      },
      type: data?.type,
      is_star: data?.is_star,
    };
    let cloneComment = [...commntListRef.current];
    cloneComment.push(resp);
    setCmntList(cloneComment);
    commntListRef.current = cloneComment;
  };

  useEffect(() => {
    setLoading(true);
    setCmntList([]);
    commentList();
  }, [id, isSubscriber]);

  useEffect(() => {
    if (socket.id) {
      socket.emit("join_room", { stream_id: String(id) });
    }
  }, [id, socket.id]);

  useEffect(() => {
    if (socket.id) {
      socket.on("comment_created_from_server", handleCommentListSocket);
      socket.on("disconnect", () => {
        socket.emit("leave_room", { stream_id: String(id) });
        socket.removeListener(
          "comment_created_from_server",
          handleCommentListSocket
        );
      });
      return () => {
        socket.removeListener(
          "comment_created_from_server",
          handleCommentListSocket
        );
      };
    }
  }, [socket.id]);

  useEffect(() => {
    let scroll_to_bottom: any = document.getElementById("inbmain");
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  });

  return (
    <>
      <div className={classNames(styles.commentHeader, "p-3")}>
        <Heading title="Comments" headingStyle={styles.headingStyle} />
      </div>
      <div
        className={classNames(
          commentListContainer
            ? commentListContainer
            : styles.comment_list_container,
          "px-sm-3 px-2  align-items-center d-flex flex-column",
          comntList?.length > 0
            ? "justify-content-start"
            : "justify-content-center"
        )}
        id={"inbmain"}
      >
        {Loading ? (
          Array.from(Array(4).keys()).map((item: any, inx: number) => {
            return <CommentLoader key={inx} isInLiveStream={true} />;
          })
        ) : comntList?.length > 0 ? (
          comntList.map((item: any, inx: number) => {
            return item?.type === 1 ? (
              <DonationCommentCard
                isInLiveStream={true}
                item={item}
                key={inx}
                index={inx}
              />
            ) : (
              <CommentCard
                item={item}
                key={inx}
                index={inx}
                isInLiveStream={true}
                isOwn={streamUserId === item?.user?.id}
                streamUserId={streamUserId}
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
      {user?.token && !guest ? (
        <div className={classNames("p-3")}>
          <CommentInput
            submitButton={handleSubmit}
            onChange={(val: string) => {
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

export default LiveCommentSection;
