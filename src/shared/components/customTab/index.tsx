import React from "react";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";

interface TabProps {
  isFull: boolean;
  tabs: string[];
  activeTab: string;
  handleActiveTab: (val: string) => void;
  noBottomBorder: boolean;
  firstTabMargin: string;
  tabItemStyle: string;
  isLeft: boolean;
  isProfileTabs: boolean;
}

const CustomTab = ({
  isFull,
  tabs,
  activeTab,
  handleActiveTab,
  noBottomBorder,
  firstTabMargin,
  tabItemStyle,
  isLeft,
  isProfileTabs,
}: Partial<TabProps>) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start",
        noBottomBorder
          ? styles.tabsContainerNoBorderBottom
          : styles.tabsContainer,
        isProfileTabs
          ? "justify-content-between justify-content-sm-start"
          : "justify-content-start"
      )}
      style={isFull ? { width: "100%" } : { width: "90%" }}
    >
      {tabs?.map((tab, ind) => {
        return (
          <div
            className={classNames(
              styles.activeTabContainer,
              ind === 0 && firstTabMargin ? firstTabMargin : "",
              isProfileTabs && styles.noPaddingContainer
            )}
            style={
              isLeft
                ? { textAlign: "left", paddingRight: "30px" }
                : { textAlign: "center" }
            }
            key={ind}
          >
            <label
              className={classNames(
                tab === activeTab ? styles.activeTab : styles.inActiveTab,
                tabItemStyle ? tabItemStyle : ""
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
  );
};

export default CustomTab;
