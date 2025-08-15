import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Trip {
    _id: string;
    venue: string;
    price: string;
    images: string[];
    duration: string;
    popularity: number;
    packageName: string;
    PackageType: string; // Used for filtering
}

interface Props {
    packageType: string;
    _id?: string;
}

const settings = (numSlides: number) => ({
    className: "center",
    infinite: numSlides > 3, // Disable infinite loop if not enough slides
    centerPadding: "60px",
    slidesToShow: Math.min(numSlides, 4), // Do not exceed number of packages
    arrows: false,
    swipeToSlide: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: Math.min(numSlides, 3),
                slidesToScroll: 1,
                infinite: numSlides > 2,
                arrows: false,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: Math.min(numSlides, 2),
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false,
                dots: true,
            },
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
            },
        },
    ],
});


const TrendingPackageCard: React.FC<{ trip: Trip }> = ({ trip }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    const handleDetailsClick = (id: string) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate(`/user/packagedetails/${id}`);
    };

    return (
        <div className="p-2 transition-transform hover:scale-105 duration-300 hover:cursor-pointer" onClick={() => handleDetailsClick(trip._id)}>
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

const SimilarPackageSlider: React.FC<Props> = ({ packageType, _id }) => {
    const sliderRef = useRef<Slider>(null);
    const [packages, setPackages] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get<{ status: string; data: Trip[] }>(
                    'http://localhost:5000/vendor/fetchallpackages'
                );

                const filtered = res.data.data
                    .filter(trip => trip.PackageType === packageType && trip._id !== _id)
                    .sort((a, b) => b.popularity - a.popularity);

                setPackages(filtered);
            } catch (err) {
                console.error("Error fetching packages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [packageType, _id]);


    if (loading) {
        return <div className="text-center py-10">Loading trending packages...</div>;
    }

    if (packages.length === 0) {
        return <div className="text-center py-10 text-gray-500">No similar packages available.</div>;
    }

    return (
        <div className="mt-24">
            <div className="container">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold">Similar Package</h1>
                    <div className="hidden md:flex space-x-4">
                        <button
                            className="border-black border-3 rounded-full w-12 h-12"
                            onClick={() => sliderRef.current?.slickPrev()}
                        >
                            <ArrowBackIosNewIcon />
                        </button>
                        <button
                            className="border-black border-3 rounded-full w-12 h-12"
                            onClick={() => sliderRef.current?.slickNext()}
                        >
                            <ArrowForwardIosIcon />
                        </button>
                    </div>
                </div>
                <div className="slider-container">
                    <Slider ref={sliderRef} {...settings(packages.length)}>
                        {packages.map(trip => (
                            <div key={trip._id} >
                                <div className="max-w-[350px] ">
                                    <TrendingPackageCard trip={trip} />
                                </div>
                            </div>
                        ))}
                    </Slider>

                </div>
            </div>
        </div>
    );
};

export default SimilarPackageSlider;
