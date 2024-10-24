import Carousel from "react-multi-carousel";


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
    partialVisibilityGutter: 24,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 4,
    slidesToSlide: 4,
    partialVisibilityGutter: 24,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
    partialVisibilityGutter: 24,
  }
};

type Props = any

export default function CarouselSimilarProducts({ children }: Props) {
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
            customTransition="transform 300ms ease-in-out"
            transitionDuration={500}
            containerClass="h-full relative"
            removeArrowOnDeviceType={["mobile"]}
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