import ChangePassword from "pages/general/changePassword";
import Donation from "pages/general/donation";
import EditProfile from "pages/general/editProfile";
import FollowerList from "pages/general/followerList";
import FollowingList from "pages/general/followingList";
import NotificationSetting from "pages/general/notificationSetting";
import Payment from "pages/general/payment";
import { useEffect, useState } from "react";
import Heading from "shared/components/heading";
import { useLocation } from "react-router";
import SettingTab from "shared/components/settingTab";
import Subscription from "pages/general/subscription";
import { tabEnum, tabs, socialAccountTabs } from "./constant";
import styles from "./style.module.scss";
import classNames from "classnames";
import { useSelector } from "react-redux";

function Settings() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const { user } = useSelector((state: any) => state.root);
  const handleActiveTab = (val: string) => {
    setActiveTab(val);
  };
  useEffect(() => {
    if (location?.search) {
      setActiveTab(tabEnum.payment);
    } else {
      setActiveTab(
        (location?.state as any)?.selectType
          ? (location?.state as any)?.selectType
          : tabEnum.editProfile
      );
    }
  }, [location?.search]);

  return (
    <div className={classNames("px-3 px-sm-0")}>
      <div className={styles.padding_container}>
        <Heading title="Settings" headingStyle={styles.setting_heading} />
      </div>
      <SettingTab
        tabs={user?.user?.social_login_id ? socialAccountTabs : tabs}
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
      />
      <div className={styles.padding_container}>
        {activeTab === tabEnum.editProfile ? (
          <EditProfile />
        ) : activeTab === tabEnum.change_password ? (
          <ChangePassword />
        ) : activeTab === tabEnum.follower ? (
          <FollowerList />
        ) : activeTab === tabEnum.following ? (
          <FollowingList />
        ) : activeTab === tabEnum.subscription ? (
          <Subscription />
        ) : activeTab === tabEnum.payment ? (
          <Payment />
        ) : activeTab === tabEnum.donation ? (
          <Donation />
        ) : (
          //  : activeTab === tabEnum.notification ? (
          //   <NotificationSetting />
          // )
          ""
        )}
      </div>
    </div>
  );
}

export default Settings;
