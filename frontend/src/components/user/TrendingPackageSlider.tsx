import React, { useRef, useState } from "react";
import Slider from "react-slick";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


interface Trip {
    _id: string;
    venue: string;
    price: string;
    images: string[];
    duration: string;
    popularity: number;
    packageName: string;
}

interface Props {
    trips: Trip[];
}

const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 4,
    arrows: false,
    swipeToSlide: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                arrows: false,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false,
                dots: true
            }
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true
            }
        }
    ],
};


const TrendingPackageCard: React.FC<{ trip: Trip }> = ({ trip }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="p-2 transition-transform hover:scale-105 duration-300 hover:cursor-pointer">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-[200px] w-full">
                    <img
                        src="/general-img-landscape.png"
                        alt="Placeholder"
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-0" : "opacity-100"}`}
                    />
                    <img
                        className={`object-cover w-full h-full transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                        loading="lazy"
                        src={trip.images[1]}
                        alt="Trip Image"
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                        }}
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-x-1 bg-white bg-opacity-80 px-2 py-1 rounded shadow text-sm">
                        <span className="font-medium">Rating:</span>
                        <span className="font-semibold">4.5</span>
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-bold mb-1">{trip.packageName}</h2>
                    <p className="text-gray-600 mb-2">{trip.venue}</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-blue-600 font-semibold">₹{trip.price}</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <AccessTimeIcon className="w-4 h-4" fontSize="small" />
                            {trip.duration}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrendingPackageSlider: React.FC<Props> = ({ trips }) => {
    const sliderRef = useRef<Slider>(null);
    const trendingPackages = trips
        .filter(trip => trip.popularity > 2)
        .sort((a, b) => b.popularity - a.popularity);

    return (
        <div className="mt-24">
            <div className="container">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold">
                        Trending Packages
                    </h1>
                    <div className="hidden md:flex  space-x-4 ">
                        <button className="border-black border-3 rounded-full w-12 h-12  " onClick={() => sliderRef.current?.slickPrev()}><ArrowBackIosNewIcon /></button>
                        <button className="border-black border-3 rounded-full w-12 h-12 " onClick={() => sliderRef.current?.slickNext()}><ArrowForwardIosIcon /></button>
                    </div>
                </div>
                <div className="slider-container">
                    <Slider ref={sliderRef} {...settings}>
                        {trendingPackages.map(trip => (
                            <TrendingPackageCard key={trip._id} trip={trip} />
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default TrendingPackageSlider