import classNames from "classnames";
import styles from "./style.module.scss";
interface Props {
  title: string;
  headingStyle: any;
}

function Heading({ title, headingStyle }: Partial<Props>) {
  return (
    <h1
      className={classNames(
        headingStyle ? headingStyle : styles.heading,
        "mb-0"
      )}
    >
      {title}
    </h1>
  );
}

export default Heading;
