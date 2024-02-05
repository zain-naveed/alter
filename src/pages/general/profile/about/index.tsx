import { NoContent } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";

interface AboutProps {
  user: any;
  id: string;
}

const About = ({ user, id }: Partial<AboutProps | any>) => {
  return user?.bio ? (
    <p
      className={classNames(
        "my-2 my-sm-4 d-flex align-items-start align-self-start text-left w-100 px-4 px-sm-0",
        styles.aboutText
      )}
    >
      {user?.bio}
    </p>
  ) : (
    <div className="d-flex flex-column justify-content-center  align-items-center w-100">
      <NoContent />
      <label className={classNames(styles.noContentText, "mt-3")}>
        Oops! Nothing here yet.
      </label>
    </div>
  );
};

export default About;
