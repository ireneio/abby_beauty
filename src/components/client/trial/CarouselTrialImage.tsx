import clsx from "clsx";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Carousel from "react-multi-carousel";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  }
};

type Props = any

export default function CarouselTrialImage({ images }: Props) {
    const carouselRef = useRef<any>(null)
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleAfterChange = (previousSlide: number, { currentSlide }: { currentSlide: number }) => {
        setCurrentSlide(currentSlide);
    };

    // const goToNext = () => {
    //     if (carouselRef.current) {
    //     carouselRef.current.next();
    //     }
    // };

    // const goToPrevious = () => {
    //     if (carouselRef.current) {
    //     carouselRef.current.previous();
    //     }
    // };

    const goToSlide = (index: number) => {
        if (carouselRef.current) {
            carouselRef.current.goToSlide(index);
        }
    };

    return (
        <>
            <Carousel
                ref={carouselRef}
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
                containerClass="relative"
                // removeArrowOnDeviceType={["mobile"]}
                // deviceType={"mobile"}
                dotListClass=""
                itemClass=""
                // renderDotsOutside
                // partialVisible={true}
                afterChange={handleAfterChange}
            >
                {images.map((image: any) => {
                    return (
                        <div key={image.id}>
                            <Image
                                src={image.url}
                                width={500}
                                height={500}
                                className="object-contain aspect-[1/1]"
                                alt={image.id}
                                priority
                            />
                        </div>
                    )
                })}
            </Carousel>
            <div className="mt-8">
                <div className="flex gap-4 overflow-auto">
                    {images.map((image: any, i: number) => {
                        return (
                            <div
                                key={i}
                                className={clsx('relative shrink-0 border p-2 w-[64px] h-[64px]', currentSlide === i ? 'border-[#000]' : 'border-[#ccc]')}
                                onClick={() => goToSlide(i)}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={image.url}
                                        width={62}
                                        height={62}
                                        className="aspect-[1/1] object-contain"
                                        alt={image.id}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
