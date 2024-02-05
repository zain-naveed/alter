import { useEffect, useRef } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./progress.scss";
interface Props {
  value: number;
}
function Progress(props: Props) {
  const { value } = props;
  return (
    <div>
      <Tooltip value={value}>
      {
        value ? <ProgressBar animated={true} now={100} />:<ProgressBar animated={true} now={0} />
      }
        
      </Tooltip>
    </div>
  );
}
const Tooltip = ({ children, value }: any) => {
  const leftOffset = useRef<number>(12);

  // useEffect(() => {
  //   handleResiz();
  //   let elem = document.getElementById("tooltiptext");
  //   // @ts-ignore
  //   elem.style.left = `${Number(value) + leftOffset.current}%`;
  // }, [value, leftOffset.current]);

  // useEffect(() => {}, [value]);

  // useEffect(() => {
  //   window.addEventListener(
  //     "resize",
  //     () => {
  //       handleResiz();
  //     },
  //     true
  //   );

  //   return () => {
  //     window.removeEventListener(
  //       "resize",
  //       () => {
  //         handleResiz();
  //       },
  //       true
  //     );
  //   };
  // }, []);

  // const handleResiz = () => {
  //   let elem2 = document.getElementById("tooltips");
  //   if (elem2?.clientWidth === 478) {
  //     if (leftOffset.current !== 6) {
  //       leftOffset.current = 6;
  //       let elem = document.getElementById("tooltiptext");
  //       // @ts-ignore
  //       elem.style.left = `${Number(value) + 6}%`;
  //     }
  //   } else if (elem2?.clientWidth === 358) {
  //     if (leftOffset.current !== 8) {
  //       leftOffset.current = 8;
  //       let elem = document.getElementById("tooltiptext");
  //       // @ts-ignore
  //       elem.style.left = `${Number(value) + 8}%`;
  //     }
  //   } else if (elem2?.clientWidth === 248) {
  //     if (leftOffset.current !== 12) {
  //       leftOffset.current = 12;
  //       let elem = document.getElementById("tooltiptext");
  //       // @ts-ignore
  //       elem.style.left = `${Number(value) + 12}%`;
  //     }
  //   }
  // };

  return (
    <div className="tooltips" id="tooltips">
      {children}
      {/* <span className="tooltiptext" id="tooltiptext">
        {value}%
      </span> */}
    </div>
  );
};

export default Progress;
