import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Heading from "shared/components/heading";
import PrivacyFooter from "shared/components/privacyFooter";
import PivacyHeaders from "shared/components/privacyHeader";
import { routeConstant } from "shared/routes/routeConstant";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { getTerms } from "shared/services/landingServices";
import BoxLoader from "shared/loader/box";
interface Props {}
let linkList = [
  {
    item: "Government agencies;",
  },
  {
    item: "Search engines;",
  },
  {
    item: "News organizations;",
  },
  {
    item: "Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and",
  },
  {
    item: "System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.",
  },
];
let linkSiteList = [
  {
    item: "commonly-known consumer and/or business information sources;",
  },
  {
    item: "dot.com community sites;",
  },
  {
    item: "associations or other groups representing charities;",
  },
  {
    item: "online directory distributors;",
  },
  {
    item: "internet portals;",
  },
  {
    item: "internet portals;",
  },
  {
    item: "accounting, law and consulting firms; and",
  },
  {
    item: "educational institutions and trade associations.",
  },
];
let linkOrganizationApproval = [
  {
    item: "By use of our corporate name; or",
  },
  {
    item: "By use of the uniform resource locator being linked to; or",
  },
  {
    item: "By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.",
  },
];
let licenseTerms = [
  {
    terms: "Republish material from Alter",
  },
  {
    terms: "Sell, rent or sub-license material from Alter",
  },
  {
    terms: "Reproduce, duplicate or copy material from Alter",
  },
  {
    terms: "Redistribute content from Alter",
  },
];
let licenseComment = [
  {
    terms:
      "You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;",
  },
  {
    terms:
      "The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;",
  },
  {
    terms:
      "The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy",
  },
  {
    terms:
      "The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.",
  },
];
let disclaimer = [
  {
    item: "limit or exclude our or your liability for death or personal injury;",
  },
  {
    item: "limit or exclude our or your liability for fraud or fraudulent misrepresentation;",
  },
  {
    item: "limit any of our or your liabilities in any way that is not permitted under applicable law; or",
  },
  {
    item: "exclude any of our or your liabilities that may not be excluded under applicable law.",
  },
];
function Terms(props: Props) {
  const [terms, setTerms] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {} = props;
  useEffect(() => {
    window?.scrollTo(0, 0);
    setLoading(true);
    getTerms()
      .then(({ data: { data } }) => {
        setTerms(data?.terms?.description);
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
      <PivacyHeaders headerTitle={"Terms & Conditions"} />
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
            dangerouslySetInnerHTML={{ __html: terms }}
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

export default Terms;
