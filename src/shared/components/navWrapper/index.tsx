import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "shared/components/header";
import SideNav from "shared/components/sideNav";
import useNetwork from "shared/hooks/useNetwork";
import { setFollowings } from "shared/redux/reducers/followingSlice";
import { GetUserFollowing } from "shared/services/userService";
import SideCanvas from "../sideCanvas";
import styles from "./style.module.scss";

interface Props {
  children: any;
}

const NavWrapper = ({ children }: Partial<Props>) => {
  const dispatch = useDispatch();
  const { user, followings } = useSelector((state: any) => state.root);
  const [isOnline, prevState] = useNetwork();
  const [displayNetworkStatus, setDisplayNetworkError] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isSideCanvas, setIsSideCanvas] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const [moreLoad, setMoreLoad] = useState<boolean>(false);

  const skip = useRef(6);
  const page = useRef(1);

  const handleFollowing = () => {
    GetUserFollowing(user?.user?.id, skip.current, page.current, "")
      .then((res) => {
        if (res?.data?.data) {
          dispatch(
            setFollowings({
              followings: res?.data?.data?.followings,
              base_url: res?.data?.data?.base_url,
              last_page: res?.data?.data?.last_page,
            })
          );
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
        setMoreLoader(false);
      });
  };

  const handleScrollShow = () => {
    let elem: any = document.getElementById("sideNav");
    elem?.addEventListener("mouseenter", () => {
      elem.classList.add(styles.showSideNavContainer);
    });
    elem?.addEventListener("mouseleave", () => {
      elem.classList.remove(styles.showSideNavContainer);
    });
  };
  useEffect(() => {
    handleScrollShow();
    if (!user?.guest && user?.user?.token) {
      handleFollowing();
    }
  }, []);

  useEffect(() => {
    if (followings?.followings?.length > 5) {
      setMoreLoad(true);
    } else {
      setMoreLoad(false);
    }
  }, [followings?.followings?.length]);
  useEffect(() => {
    let doc: any = window.document.getElementById("mainContainer");
    if (doc) {
      doc.style.overflowY = "scroll";
    }
  });

  useEffect(() => {
    if (isOnline && prevState !== isOnline) {
      setTimeout(() => {
        setDisplayNetworkError(false);
      }, 2000);
    } else if (!isOnline) {
      setDisplayNetworkError(true);
    }
  }, [isOnline]);

  return (
    <div className={classNames(styles.topLevelContainer, "p-0 m-0 ")}>
      {displayNetworkStatus ? (
        <div
          className={classNames(
            styles.networkContainer,
            isOnline && prevState !== isOnline
              ? styles.connect
              : !isOnline
              ? styles.disconnect
              : ""
          )}
        >
          <label className={classNames(styles.networkLabel)}>
            {isOnline && prevState !== isOnline
              ? "Network Connected"
              : !isOnline
              ? "No Internet Connectivity"
              : ""}
          </label>
        </div>
      ) : null}
      <SideCanvas
        isOpen={isSideCanvas}
        setIsOpen={setIsSideCanvas}
        sideNavUsers={followings?.followings}
        loading={loading}
        moreLoad={moreLoad}
        moreLoader={moreLoader}
        loadMore={() => {
          skip.current = skip.current + 6;
          setMoreLoader(true);
          handleFollowing();
        }}
      />
      <div
        className={classNames(
          styles.sideNavContainer,
          isOpen ? styles.sideNavFull : styles?.sideNavHalf
        )}
        id="sideNav"
      >
        <SideNav
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sideNavUsers={followings?.followings}
          loading={loading}
          moreLoad={moreLoad}
          moreLoader={moreLoader}
          loadMore={() => {
            skip.current = skip.current + 6;
            setMoreLoader(true);
            handleFollowing();
          }}
        />
      </div>
      <div id="mainContainer" className={classNames(styles.mainContainer)}>
        <Header isSideCanvas={isSideCanvas} setIsSideCanvas={setIsSideCanvas} />
        {children}
      </div>
    </div>
  );
};

export default React.memo(NavWrapper);
