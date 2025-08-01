import Slider from "react-slick";
import { useRef } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface Trip {
    _id: string;
    venue: string;
    price: string;
    images: string[];
    duration: string;
    popularity: number;
}

interface UniquePopularVenue {
    _id: string;
    venue: string;
    image: string;
}

interface Props {
    trips: Trip[];
}

const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    arrows: false,
    swipeToSlide: true,

    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
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
const PopularDestinationSlider: React.FC<Props> = ({ trips }) => {
    const sliderRef = useRef<Slider>(null);
    const popularTrips = trips.filter(trip => trip.popularity > 0);

    // ✅ Create a Map to hold unique venues and the full Trip object
    const venueMap: Map<string, Trip> = new Map();

    for (const trip of popularTrips) {
        if (!venueMap.has(trip.venue)) {
            venueMap.set(trip.venue, trip);
        }
    }

    // ✅ Convert Map values (Trip) to UniquePopularVenue[]
    const uniquePopularVenues: UniquePopularVenue[] = Array.from(venueMap.values()).map(trip => ({
        _id: trip._id,
        venue: trip.venue,
        image: trip.images[0]
    }));


    return (
        <div className="mt-24">
            <div className="container">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold">
                        Popular Destinations
                    </h1>
                    <div className="hidden md:flex  space-x-4 ">
                        <button className="border-black border-3 rounded-full w-12 h-12  " onClick={() => sliderRef.current?.slickPrev()}><ArrowBackIosNewIcon /></button>
                        <button className="border-black border-3 rounded-full w-12 h-12 " onClick={() => sliderRef.current?.slickNext()}><ArrowForwardIosIcon /></button>
                    </div>
                </div>
                <div className="slider-container ">
                    <Slider ref={sliderRef} {...settings}>
                        {uniquePopularVenues.map(venu => (
                            <div
                                key={venu._id}
                                className="relative h-[300px] flex items-center justify-center rounded-lg border border-gray-200 overflow-hidden group hover:cursor-pointer   "
                            >
                                <img
                                    src={venu.image}
                                    loading="lazy"
                                    alt={venu.venue}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient overlay at the bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                                <h2 className="absolute bottom-6 left-4 z-20 text-white text-xl font-semibold px-3 py-1 rounded">
                                    {venu.venue}
                                </h2>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default PopularDestinationSlider;
