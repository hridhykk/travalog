import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FilterSearch from "./FilterSearch";
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Trip {
  _id: string;
  venue: string;
  price: string;
  images: string[];
  duration: string;
  packageName: string;
  popularity: number;
  PackageType: string;
}

interface TripResponse {
  status: string;
  data: Trip[];
}




const PopularTrips: React.FC = () => {

  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TripResponse>("http://localhost:5000/vendor/fetchallpackages");
        setTrips(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips. Please try again later.");
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) =>
    trip.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading trips...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  const handleDetailsClick = (id: string) => {
    console.log(id);

    navigate(`/user/packagedetails/${id}`); // Add a leading slash
  };





  return (
    <section>
      <div className="h-16" />
      {/* Search Banner */}
      <div className="relative">
        <FilterSearch trips={trips} />
      </div>
      <div className="container-flex mx-auto h-36 md:h-20" />



      {/* Spacing between background and Popular Trips */}
      <div className="mt-8  py-10">
        <div className="container mx-auto px-4">
          {/* Popular Trips Heading */}
          <h1 className="text-4xl font-extrabold font-serif bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
            Discover Your package
          </h1>

          {filteredTrips.length === 0 ? (
            <div className="text-center text-gray-500">
              No trips found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.slice(0, 11).map((trip) => (

                <div className="p-2 transition-transform hover:scale-105 duration-300 hover:cursor-pointer" onClick={() => handleDetailsClick(trip._id)} key={trip._id}>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative h-[200px] w-full">
                      <img
                        src={trip.images[1] || "/placeholder.jpg"}
                        onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                        className="w-full h-full object-cover"
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
                      <p className="text-gray-600 mb-2">{trip.PackageType
                      }</p>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Image toggle component inside the same file
const ImageToggle: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleImageClick = () => {
    setCurrentImage((prev) => (prev === 0 ? 1 : 0)); // Toggle between the first and second image
  };

  return (
    <img
      src={images[currentImage]}
      alt="Trip Image"
      onClick={handleImageClick}
      className="h-56 w-full object-cover cursor-pointer"
    />
  );
};

export default PopularTrips;
