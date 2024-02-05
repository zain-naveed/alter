import { useEffect } from "react";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";

interface TabProps {
  tabs: string[];
  activeTab: string;
  handleActiveTab: (val: string) => void;
}

function SettingTab(props: Partial<TabProps>) {
  const { tabs, activeTab, handleActiveTab } = props;

  useEffect(() => {
    window.addEventListener("click", (e: any) => {
      if (e) {
        let getEle: any = document.getElementById("tabContainer");
        if (getEle) {
          // @ts-ignore
          getEle.scrollLeft =
            e.target.offsetLeft - e.target.parentNode.offsetWidth / 2;
        }
      }
    });
  });

  return (
    <>
      <div className={classNames(styles.tab_container)}>
        <div
          id="tabContainer"
          className={classNames(
            "d-flex align-items-center justify-content-start",
            styles.tabsContainer,
            "justify-content-start",
            styles.leftPaddding
          )}
          style={{ width: "100%" }}
        >
          {tabs?.map((tab, ind) => {
            return (
              <div
                id="tab_item"
                className={classNames(styles.activeTabContainer)}
                style={{ textAlign: "left", paddingRight: "30px" }}
                key={ind}
              >
                <label
                  className={classNames(
                    tab === activeTab ? styles.activeTab : styles.inActiveTab
                  )}
                  key={ind}
                  onClick={() => {
                    handleActiveTab?.(tab);
                  }}
                >
                  {tab}
                  {tab === activeTab && (
                    <div className={classNames(styles.activeTabThumb)} />
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.tab_container_border}></div>
    </>
  );
}

export default SettingTab;
