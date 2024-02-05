import { PageArrowForward } from "assets";
import classNames from "classnames";
import { useRef, useState } from "react";
import CustomButton from "shared/components/customButton";
import Title from "shared/components/title";
import { isNumberCheck } from "shared/utils/helper";
import styles from "./style.module.scss";
interface Props {
  page: number | any;
  setPage(val: any): any;
  seChngetPage(val: any): any;
  lastPage: any;
  listSize: any;
}

function Pagination(props: Partial<Props>) {
  const { page, setPage, lastPage, listSize,seChngetPage } = props;
  const pageRef = useRef<string>(page);
  const [isNumber, setIsNumber] = useState<boolean>(false);

  function myKeyPress(e: any) {
    if (e.code === "Backspace") {
      setIsNumber(true);
    } else {
      setIsNumber(isNumberCheck(e));
    }
  }

  const pageInputHandler = (text: string) => {
    if (Number(text) > 0) {
      if (isNumber) {
        if (Number(text) < lastPage + 1) {
          setPage?.(text);
          pageRef.current = text;
          if(text){
            
            seChngetPage?.(text);
          }
        } else {
          
          setPage?.(lastPage);
          pageRef.current = lastPage;
          seChngetPage?.(lastPage);
        }
      } else {
        setPage?.(1);
        pageRef.current = "1";
        seChngetPage?.(1);
      }
    } else if (text === "") {
      setPage?.(text);
      pageRef.current = text;
      if(text){
        seChngetPage?.(text)
      }
    } else {   
      setPage?.(1);
      pageRef.current = "1";
      seChngetPage?.(1)
    }
  };

  return (
    <>
      <div className="justify-content-center justify-content-sm-between align-items-center d-flex">
        <Title
          title={`Showing ${listSize} results for page ${page} of ${lastPage}`}
          titleStyle={styles.page_title}
        />
        <div className="d-flex">
          <CustomButton
            Icon={PageArrowForward}
            iconStyle={styles.rotate}
            containerStyle={classNames(
              page === 1 || page === ""
                ? styles.page_prev
                : styles.page_forward,
              "me-2"
            )}
            submitHandle={() => {
              if (page !== 1) {
                setPage?.(page ? page - 1 : 1);
                seChngetPage?.(page ? page - 1 : 1)
              }
            }}
            isDisable={page === ""}
          />
          <input
            type={"text"}
            value={page}
            onChange={(e: any) => pageInputHandler(e.target.value)}
            className={styles.page_input}
            onKeyDown={myKeyPress}
            onBlur={() => {
              if (pageRef.current === "") {
                setPage?.(1);
              }
            }}
          />
          <CustomButton
            Icon={PageArrowForward}
            containerStyle={classNames(
              page === lastPage ? styles.page_prev : styles.page_forward,
              "ms-2"
            )}
            submitHandle={() => {
              if (page < lastPage) {
                setPage?.(page ? page + 1 : 1);
                seChngetPage?.(page ? page + 1 : 1)
              }
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Pagination;
