import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    // slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 24,
    // slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
    partialVisibilityGutter: 24,
  }
};

type Props = any

export default function CarouselProduct({ children }: Props) {
    return (
        <Carousel
            swipeable={true}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={false}
            autoPlay={false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="h-full relative"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            // deviceType={"mobile"}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            renderButtonGroupOutside
            // renderDotsOutside
            partialVisible={true}
        >
            {children}
        </Carousel>
    )
}