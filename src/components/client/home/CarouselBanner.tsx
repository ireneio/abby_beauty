import clsx from "clsx";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  }
};

const CustomDot = ({ carouselItems, onClick, ...rest }: any) => {
  const {
    onMove,
    index,
    active,
    carouselState: { currentSlide, deviceType }
  } = rest;
  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  return (
    <button
      className={clsx("rounded-full bg-secondary border shadow-lg p-[2px]")}
      onClick={() => onClick()}
    >
      <div className={clsx("w-[10px] h-[10px] rounded-full", active ? 'border border-primary' : '')}></div>
    </button>
  );
};

type Props = any

export default function CarouselBanner({ children }: Props) {
    return (
        <Carousel
            swipeable={true}
            draggable={false}
            showDots={true}
            customDot={<CustomDot carouselItems={children} />}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={false}
            autoPlay={false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="pb-8"
            removeArrowOnDeviceType={["mobile"]}
            // deviceType={"mobile"}
            dotListClass="flex gap-2"
            itemClass="carousel-item-padding-40-px"
            renderButtonGroupOutside={true}
        >
            {children}
        </Carousel>
    )
}