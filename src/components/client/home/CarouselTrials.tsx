import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
    slidesToSlide: 6,
    partialVisibilityGutter: 24,
    // slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 4,
    slidesToSlide: 4,
    partialVisibilityGutter: 24,
    // slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
    partialVisibilityGutter: 24,
  }
};

type Props = any

export default function CarouselTrials({ children }: Props) {
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
            containerClass="py-4"
            removeArrowOnDeviceType={["mobile"]}
            // deviceType={"mobile"}
            dotListClass="custom-dot-list-style"
            itemClass="mr-8"
            renderButtonGroupOutside
            // renderDotsOutside
            partialVisible={true}
        >
            {children}
        </Carousel>
    )
}