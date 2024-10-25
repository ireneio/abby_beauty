import Carousel from "react-multi-carousel";


const responsive = {
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  }
};

type Props = any

export default function CarouselBrand({ children }: Props) {
    return (
        <Carousel
          swipeable={true}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={false}
          autoPlay={false}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={500}
          // containerClass="px-4"
          // removeArrowOnDeviceType={["mobile"]}
          // deviceType={"mobile"}
          dotListClass="custom-dot-list-style"
          // itemClass="md:mr-8"
          renderButtonGroupOutside
          // renderDotsOutside
          // partialVisible={true}
        >
          {children}
        </Carousel>
    )
}