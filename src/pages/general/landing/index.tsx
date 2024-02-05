import {
  Client_One,
  HomeLogo,
  landingHeader,
  LiveStream,
  macBook,
  OneIcon,
  ShortArrow_One,
  ShortArrow_Two,
  ShortIcon,
  ThreeIcon,
  TowIcon,
  UsersIcon,
  Client_Avatar_Two,
  Client_Three,
  Client_Four,
  Client_Five,
  Client_Six,
} from "assets";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Title from "shared/components/title";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";
import { Fragment, useState } from "react";
import { LoginUser } from "shared/services/authService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "shared/redux/reducers/userSlice";
import { setRouteReducer } from "shared/redux/reducers/routeSlice";
import { toastMessage } from "shared/components/toast";
let arr = [
  {
    icon: <LiveStream />,
    heading: "Go Live Anytime, Anywhere",
    description:
      "It is easier to retain an existing customer. That’s why successful businesses put effort into retaining their customers.",
  },
  {
    icon: <ShortIcon />,
    heading: "Upload Your Shorts",
    description:
      "It is easier to retain an existing customer. That’s why successful businesses put effort into retaining their customers.",
  },
  {
    icon: <UsersIcon />,
    heading: "Make New Friends",
    description:
      "It is easier to retain an existing customer. That’s why successful businesses put effort into retaining their customers.",
  },
];
let shortList = [
  {
    icon: <OneIcon className={styles.short_numb_icon} />,
    heading: "Create Account",
    description:
      "It is easier to retain an existing customer. That’s why successful businesses put effort.",
  },
  {
    icon: <TowIcon className={styles.short_numb_icon} />,
    heading: "Verify Your Email",
    description:
      "It is easier to retain an existing customer. That’s why successful businesses put effort.",
  },
  {
    icon: <ThreeIcon className={styles.short_numb_icon} />,
    heading: "Start Streaming",
    description:
      "It is easier to retain an existing customer. That’s why successful businesses put effort.",
  },
];
let our_clients: {
  image: any;
  name: string;
  destignation: string;
  feedback: string;
}[] = [
  {
    image: Client_One,
    name: "Mila McSabbu",
    destignation: "Freelance Designer",
    feedback:
      "“We were blown away when we saw Mixland. The combination of social, email, knowledge base, mobile, ets.”",
  },
  {
    image: Client_Avatar_Two,
    name: "Robert Fox",
    destignation: "UI/UX Designer",
    feedback:
      "“Mixlandhas helped us become much more efficient. Provided consistency in messaging too. It’s not a lot of voices.”",
  },
  {
    image: Client_Three,
    name: "Jenny Wilson",
    destignation: "Web Developer",
    feedback:
      "Mixland is a very friendly tool. As it sits inside Gmail, it doesn’t give you an alien feel. Complexities of a ticketing.",
  },
  {
    image: Client_Four,
    name: "Wade Warren",
    destignation: "Director, Technology",
    feedback:
      "“We test and compare the best support management software for collaborating with a team, hitting deadlines.”",
  },
  {
    image: Client_Five,
    name: "Savannah Nguyen",
    destignation: "Support Manager",
    feedback:
      "“Support desk is the skimping on core features. It's strong at enabling with collaboration on visual materials.”",
  },
  {
    image: Client_Six,
    name: "Cody Fisher",
    destignation: "Director of IT",
    feedback:
      "“Support to be a team's best option for project management, but when all the stars align, it's a powerful tool.”",
  },
];
function Landing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSelector((state: any) => state.root);

  const handleLogIn = async () => {
    if (user?.guest) {
      navigate(routeConstant.feed.path);
    } else {
      setLoading(true);
      let formData = new FormData();
      formData.append("email", "guest_user");
      formData.append("password", "guest_user");

      LoginUser(formData)
        .then(({ data: { status, data, message } }) => {
          if (status) {
            let resp = {
              isLoggedIn: true,
              user: data?.user,
              guest: true,
            };
            dispatch(setUser(resp));
            dispatch(
              setRouteReducer({ routeType: "guest", originScreen: "/" })
            );
            navigate(routeConstant.feed.path);
          } else {
            toastMessage("Error", message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <img
        src={landingHeader}
        className={classNames(styles.header_cover)}
        alt="landing-bg"
      />
      <div className={styles.header_container}>
        <div className={classNames("container", styles.header)}>
          <div
            className={classNames(
              "d-flex justify-content-between align-items-center flex-column flex-sm-row",
              styles.nav_margin
            )}
          >
            <HomeLogo
              className={classNames(styles.logo, "pointer")}
              onClick={() => navigate(routeConstant.default.path)}
            />
            <div className={classNames("d-flex gap-2")}>
              <CustomButton
                title="Home"
                submitHandle={handleLogIn}
                containerStyle={styles.guestButton}
                loading={loading}
                isDisable={loading}
                spinnerColor="#ff754c"
              />
              <CustomButton
                title="Register Now"
                submitHandle={() => {
                  navigate(routeConstant.signup.path);
                }}
                containerStyle={styles.signupButton}
              />
            </div>
          </div>
          <div className={styles.headerContent}>
            <Heading
              title="Let’s Cast Your Ideas"
              headingStyle={styles.header_heading}
            />
            <div className={styles.header_paragraph}>
              <Title title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tincidunt est vel bibendum pharetra. Sed in scelerisque leo maecenas cursus amet nunc." />
            </div>

            <CustomButton
              title="Start Your Streaming"
              containerStyle={styles.stream_button}
              submitHandle={() => {
                navigate(routeConstant.login.path);
              }}
            />
            <img src={macBook} className={styles.macImg} alt="mac-pic" />
          </div>
        </div>
      </div>
      <section className={classNames("container", styles.grad_cont)}>
        <div className={styles.gradient_light_blue}></div>
        <div className={styles.gradient_light_yellow}></div>
        <div className={classNames("row", styles.introRow)}>
          <div className="col-12 col-md-6 text-center text-md-start">
            <Heading title=" Connecting people with Entertainment" />
          </div>
          <div className="col-12 col-md-6">
            <p
              className={classNames(
                "text-center mt-2 mt-md-0 text-sm-start",
                styles.introPra
              )}
            >
              A webinar provides an interesting and informative platform for new
              & existing customers that will deliver really valuable content to
              your target audience. It's a great way to build up relationships
              and create awareness of your brand.
            </p>
          </div>
        </div>
        <div className={classNames("row")}>
          {arr.map((item: any, inx: number) => {
            return (
              <div
                className={classNames("col-12 col-md-4 text-start")}
                key={inx}
              >
                <div
                  className={classNames(
                    inx ? styles.border_left : "",
                    styles.introCardPadding
                  )}
                >
                  {item.icon}
                  <Heading
                    title={item.heading}
                    headingStyle={styles.introCardHeading}
                  />
                  <p
                    className={classNames(
                      "text-start",
                      styles.introPra,
                      styles.introCardPara
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className={styles.work_Section}>
        <div className={classNames(styles.work_header_container)}>
          <Heading title="How It Works" headingStyle={styles.work_heading} />
          <p className={classNames(styles.work_paragraph)}>
            A webinar provides an interesting and informative platform for new &
            existing customers that will deliver really valuable content to your
            target audience. It's a great way to build up relationships and
            create awareness of your brand.
          </p>
        </div>
        <div className="container">
          <div className={classNames("row", styles.work_container)}>
            {shortList.map((item: any, inx: number) => {
              return (
                <Fragment key={inx}>
                  {" "}
                  <div
                    className={classNames(
                      "col-12 col-md-3",
                      inx === 2 ? styles.margin_bottom : "",
                      inx === arr.length - 1
                        ? styles.last_col
                        : inx === 1
                        ? styles.center_col
                        : ""
                    )}
                  >
                    {item.icon}
                    <Heading
                      title={item.heading}
                      headingStyle={styles.work_item_heading}
                    />
                    <p
                      className={classNames(
                        "text-center",
                        styles.work_item_para
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                  {inx === 0 ? (
                    <div
                      className={classNames(
                        "col-1",
                        styles.short_arrow,
                        styles.removeShortArrow
                      )}
                    >
                      <img src={ShortArrow_One} alt="arrow-1" />
                    </div>
                  ) : inx === 1 ? (
                    <div
                      className={classNames(
                        "col-1",
                        styles.short_arrow_right,
                        styles.removeShortArrow
                      )}
                    >
                      <img src={ShortArrow_Two} alt="arrow-2" />
                    </div>
                  ) : (
                    ""
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </section>
      <div className={styles.expereience_main}>
        <div className="container">
          <Heading
            title="Our blessed clients said about their experience"
            headingStyle={styles.exp_heading}
          />
          <div className={classNames("row", styles.exp_row_margin)}>
            {our_clients.map((item: any, inx: number) => {
              return (
                <Fragment key={inx}>
                  <div className="col-12 col-md-4 my-2" key={`image-${inx}`}>
                    <div className={classNames(styles.cardContainer)}>
                      <div className={styles.cardSubContainer}>
                        <div className={classNames("d-flex")}>
                          <img
                            src={item.image}
                            className={classNames(styles.card_Avatar)}
                            alt="user-pic"
                          />
                          <div
                            className={classNames(
                              styles.cardHeader,
                              "text-start"
                            )}
                          >
                            <Heading
                              title={item.name}
                              headingStyle={styles.cardHeading}
                            />
                            <Title
                              title={item.destignation}
                              titleStyle={styles.cardTitle}
                            />
                          </div>
                        </div>
                        <p className={styles.cardParagraph}>{item.feedback}</p>
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>

          <div className={classNames(styles.stream_container)}>
            <div
              className={classNames(
                "row d-flex justify-content-between",
                styles.stream_row
              )}
            >
              <div className="col-12 col-md-5 text-start">
                <Heading
                  title="We provide the ultimate streaming platform."
                  headingStyle={styles.stream_heading}
                />
              </div>
              <div className="col-12 col-sm-3 mt-2 mt-md-0 col-md-2 d-flex align-items-center">
                <CustomButton
                  title="Get Started Now"
                  submitHandle={() => {
                    navigate(routeConstant.login.path);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={classNames(styles.footer_container)}>
        <div
          className={classNames(
            "container d-flex justify-content-between mb-2",
            styles.reverse
          )}
        >
          <span className={styles.copyRight}>
            © Copyright 2023, All Rights Reserved
          </span>
          <div>
            <span
              className={classNames(styles.privacyItem, styles.privacy_margin)}
              onClick={() => {
                navigate(routeConstant.privacy.path);
              }}
            >
              Privacy Policy
            </span>
            <span
              className={styles.privacyItem}
              onClick={() => {
                navigate(routeConstant.terms.path);
              }}
            >
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;
