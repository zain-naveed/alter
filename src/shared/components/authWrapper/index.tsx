import styles from "./style.module.scss";

interface Props {
  children: any;
}
const AuthWrapper = ({ children }: Partial<Props>) => {
  return (
    <div className={styles.authMainContainer}>
      <div className={styles.blackWrapperContainer}>
        <div className="mt-5 mb-5 d-flex justify-content-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
