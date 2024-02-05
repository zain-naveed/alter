import { LeftArrowIcon, RightArrowIcon } from "assets";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "./style.scss";
import SingleSlide from "./singleSlide";
interface SliderInterface {
  streams: any[];
  isLive: any;
}
function CustomSlider(props: SliderInterface) {
  const { streams, isLive } = props;

  const [active, setActive] = useState(0);

  const sliderRef = useRef<any>(null);
  const left = useRef(0);

  const handleAfterChange = (index: number) => {
    setActive(index);
    var elem = document.getElementById(`dotsSliderContainer`);
    var imgElem: any = document.getElementById(`img${index}`);
    left.current = imgElem?.offsetLeft;
    elem?.scrollTo({ top: 9, left: left.current, behavior: "smooth" });
  };

  const settings = {
    afterChange: handleAfterChange,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleLeft = () => {
    sliderRef.current.slickPrev();
  };
  const handleRight = () => {
    sliderRef.current.slickNext();
  };

  return (
    <div className="position-relative">
      <Slider {...settings} ref={sliderRef}>
        {streams?.map((item, key) => {
          return (
            <SingleSlide item={item} isLive={isLive} index={key} key={key} />
          );
        })}
      </Slider>
      {streams?.length > 1 && (
        <div
          className={classNames("dotsMainContainer d-flex justify-content-end")}
        >
          <div className={classNames("position-relative dotsSubContainer")}>
            <div className={classNames("leftArrow")} onClick={handleLeft}>
              <LeftArrowIcon />
            </div>
            <div className="dotsSliderContainer" id="dotsSliderContainer">
              {streams.map((item: any, ind) => {
                return (
                  <div
                    className={` ${
                      streams?.length === 2
                        ? "slide-img-container-2"
                        : streams?.length === 3
                        ? "slide-img-container-3"
                        : "slide-img-container"
                    }   ${active === ind ? "slide-container-highlighted" : ""}`}
                    id={`img${ind}`}
                    onClick={() => {
                      setActive(ind);
                      sliderRef.current.slickGoTo(ind);
                    }}
                    key={ind}
                  >
                    <img
                      src={item?.thumbnail_base_url + item?.thumbnail}
                      className={`slide-img`}
                      alt="dot"
                    />
                  </div>
                );
              })}
            </div>
            <div className={classNames("rightArrow")} onClick={handleRight}>
              <RightArrowIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const propsAreEqual = (
  prevProps: Readonly<SliderInterface>,
  nextProps: Readonly<SliderInterface>
) => {
  return prevProps.streams === nextProps.streams;
};

export default React.memo(CustomSlider, propsAreEqual);
