import { useEffect, useState } from "react";
import PrivacyFooter from "shared/components/privacyFooter";
import PivacyHeaders from "shared/components/privacyHeader";
import BoxLoader from "shared/loader/box";
import { getPrivacyPolicy } from "shared/services/landingServices";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface Props {}
function Privacy(props: Props) {
  const [privacy, setPrivacy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {} = props;
  useEffect(() => {
    window?.scrollTo(0, 0);
    setLoading(true);
    getPrivacyPolicy()
      .then(({ data: { data } }) => {
        setPrivacy(data?.terms?.description);
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PivacyHeaders headerTitle={"Privacy Policy"} />
      <div
        className={classNames("container text-start", styles.privacyContainer)}
      >
        {loading ? (
          <>
            {Array.from(Array(4).keys()).map((item, inx) => {
              return (
                <BoxLoader
                  iconStyle={classNames(
                    styles.paragraph_container_loader,
                    "mb-2"
                  )}
                  key={inx}
                />
              );
            })}
            <Spacer>
              {Array.from(Array(4).keys()).map((item, inx) => {
                return (
                  <BoxLoader
                    iconStyle={classNames(
                      styles.paragraph_container_loader,
                      "mb-2"
                    )}
                    key={inx}
                  />
                );
              })}
            </Spacer>
            <Spacer>
              {Array.from(Array(4).keys()).map((item, inx) => {
                return (
                  <BoxLoader
                    iconStyle={classNames(
                      styles.paragraph_container_loader,
                      "mb-2"
                    )}
                    key={inx}
                  />
                );
              })}
            </Spacer>
            <Spacer>
              {Array.from(Array(4).keys()).map((item, inx) => {
                return (
                  <BoxLoader
                    iconStyle={classNames(
                      styles.paragraph_container_loader,
                      "mb-2"
                    )}
                    key={inx}
                  />
                );
              })}
            </Spacer>
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: privacy }}
            className={classNames(styles.paragraph_container)}
          />
        )}
      </div>
      <PrivacyFooter />
    </>
  );
}
const Spacer = ({ children }: any) => {
  return <div className={styles.space}>{children}</div>;
};

export default Privacy;
