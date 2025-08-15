import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Tag, ShieldCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface Trip {
  _id: string;
  venue: string;
  price: string;    
  images: string[];
  duration: string;
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
      {/* Search Banner */}
      <div
        className="relative bg-cover bg-center w-full h-[500px] flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage: "url('/img4.jpeg')",
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Content */}
        <h1 className="relative z-10 text-4xl font-extrabold mb-4 text-center drop-shadow-md">
          Search Your Favorite Destinations Worldwide!
        </h1>
        <div className="relative z-10 w-full max-w-md">
          <div className="flex">
            <input
              type="text"
              placeholder="Search destinations..."
              className="flex-1 px-4 py-2 rounded-l-md focus:outline-none text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container-flex mx-auto h-72">
        <div className="grid grid-cols-1 bg-gray-100 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="flex flex-col container-flex h-34 items-center justify-center p-8 text-center">
            <div className="bg-gray-200 rounded-full p-4 mb-4">
              <User size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Handpicked Activities</h3>
            <p className="text-gray-600">Explore the best experiences<br /> in your favourite cities</p>
          </div>

          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-200 rounded-full p-4 mb-4">
              <Tag size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Lowest Prices</h3>
            <p className="text-gray-600">Guaranteed lowest prices.<br /> Anyday, everyday.</p>
          </div>

          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-200 rounded-full p-4 mb-4">
              <ShieldCheck size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">100% Secure</h3>
            <p className="text-gray-600">Every transaction is secure.<br /> Your money is safe</p>
          </div>
        </div>
      </div>

      {/* Spacing between background and Popular Trips */}
      <div className="mt-8 bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          {/* Popular Trips Heading */}
          <h1 className="text-4xl font-extrabold font-serif bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
            Popular Trips
          </h1>

          {filteredTrips.length === 0 ? (
            <div className="text-center text-gray-500">
              No trips found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredTrips.slice(0, 9).map((trip) => (
                
                <div
                key={trip._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                  {/* Display two images and toggle between them */}
                  <div className="relative">
                {trip.images && trip.images.length > 1 ? (
  <ImageToggle images={trip.images} />
) : trip.images && trip.images.length === 1 && trip.images[0] ? (
  <img
    src={
      trip.images[0].includes("/uploadimages/")
        ? decodeURIComponent(trip.images[0].split("/uploadimages/")[1])
        : trip.images[0]
    }
    alt={trip.venue}
    className="h-56 w-full object-cover"
    onError={(e) => {
      e.currentTarget.src = "https://via.placeholder.com/800x600?text=No+Image+Available";
    }}
  />
) : (
  <div className="h-56 w-full bg-gray-300 flex justify-center items-center">
    <span className="text-white text-xl">No Image</span>
  </div>
)}

                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{trip.venue}</h3>
                    <p className="text-gray-600 mb-4">Price: {trip.price}</p>
                    <button
                      className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                      onClick={() => handleDetailsClick(trip._id)} // Handle the button click
                    >

                      Show Details
                    </button>
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
