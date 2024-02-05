import React, { useState } from "react";
import Title from "shared/components/title";
import Swtich from "shared/components/switch";
import Heading from "shared/components/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { toggleNotification } from "shared/services/settingsService";
import { useDispatch, useSelector } from "react-redux";
import { toastMessage } from "shared/components/toast";
import { setUser } from "shared/redux/reducers/userSlice";
interface Props {}

function NotificationSetting(props: Props) {
  const {} = props;
  const dispatch = useDispatch();
  const {
    user: { user },
  } = useSelector((state: any) => state.root);

  const togleNotification = () => {
    let obj: any = {};
    if (!user?.is_enabled_notification) {
      obj["value"] = 1;
    } else {
      obj["value"] = 0;
    }
    toggleNotification(obj)
      .then(({ data: { data } }) => {
        let cloneUser = { ...user };
        cloneUser.is_enabled_notification = Number(data.notification_value);
        let resp = {
          isLoggedIn: true,
          user: cloneUser,
        };
        dispatch(setUser(resp));
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      });
    // setToggleDonation(!toggleDonation)
  };

  return (
    <div className={classNames("py-4")}>
      <Heading
        title="Notifications Settings"
        headingStyle={classNames(styles.heading)}
      />
      <div
        className={classNames(
          "d-flex justify-content-between align-items-center",
          styles.disable_don
        )}
      >
        <div className={styles.notification_container}>
          <Heading
            title="Email Notifications"
            headingStyle={classNames(
              styles.donation_heading,
              styles.top_margin
            )}
          />
          <Title
            title="Get emails to find out what’s going on when you’re not online. You’ll receive notification about their comments, streams and shorts."
            titleStyle={styles.donation_title}
          />
        </div>
        <Swtich
          toggleDonation={!!user?.is_enabled_notification}
          handleChange={() => togleNotification()}
        />
      </div>
    </div>
  );
}

export default NotificationSetting;
