import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface PackageData {
  _id:string;
  packageName?: string;
  companyName?: string;
  venue?: string;
  price?: string | number;
  duration?: string;
  inclusion: string[];
  exclusion: string[];
  packageDescription?: string;
  dayDescriptions: string[];
  images: string[];
  maxPersons?: number;
  minPersons?: number;
  availableAndBookedDates: {
    date: string;
    maximumAllowedPackages: number;
    numberOfPackagesBookedByUser: number;
  }[];
}

const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;

    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PackageData>(
          `http://localhost:5000/vendor/fetchpackage`,
          { params: { id } }
        );

        
        setPackageData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching package details:", err);
        setError("Could not load package details. Please try again later.");
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleBookPackage = (id:string) => {
    // This can redirect to a booking form or perform the booking logic
    
    navigate(`/user/slotavailability/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-blue-600">Loading package details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        {error}
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="text-center text-gray-500 py-10">
        No package details available.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
       

       <div className="relative">
  {packageData.images.length > 0 ? (
    <img
      src={packageData.images[0]} // Use the direct Cloudinary URL
      alt={packageData.packageName}
      className="w-full h-80 object-cover rounded-t-lg"
      onError={(e) => {
        e.currentTarget.src = "https://via.placeholder.com/800x600?text=No+Image+Available";
      }}
    />
  ) : (
    <div className="w-full h-80 bg-gray-300 flex justify-center items-center">
      <span className="text-white text-xl">No Image Available</span>
    </div>
  )}
  <div className="absolute top-0 left-0 right-0 bottom-0 bg-opacity-40 flex justify-center items-center">
    <h1 className="text-white text-4xl font-semibold">{packageData.packageName}</h1>
  </div>
</div>
        {/* <div className="flex overflow-x-auto space-x-4 py-4">
  {packageData.images.map((imgUrl, idx) => (
    <img
      key={idx}
      src={imgUrl}
      alt={`Package Image ${idx + 1}`}
      className="h-40 rounded shadow"
      onError={(e) => {
        e.currentTarget.src = "https://via.placeholder.com/800x600?text=No+Image+Available";
      }}
    />
  ))}
</div> */}



          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="text-lg text-gray-700">
                  <strong>Company:</strong> {packageData.companyName}
                </div>
                <div className="text-lg text-gray-700">
                  <strong>Venue:</strong> {packageData.venue}
                </div>
                <div className="text-lg text-gray-700">
                  <strong>Price:</strong> ₹{packageData.price}
                </div>
                <div className="text-lg text-gray-700">
                  <strong>Duration:</strong> {packageData.duration}
                </div>
                {packageData.maxPersons && (
                  <div className="text-lg text-gray-700">
                    <strong>Max Persons:</strong> {packageData.maxPersons}
                  </div>
                )}
                {packageData.minPersons && (
                  <div className="text-lg text-gray-700">
                    <strong>Min Persons:</strong> {packageData.minPersons}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-lg text-gray-700">
                  <strong>Inclusion:</strong> {packageData.inclusion.join(", ")}
                </div>
                <div className="text-lg text-gray-700">
                  <strong>Exclusion:</strong> {packageData.exclusion.join(", ")}
                </div>
                <div className="text-xl font-semibold text-gray-800">Description</div>
                <p className="text-gray-600">{packageData.packageDescription}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="text-xl font-semibold text-gray-800">Day Descriptions</div>
              <ul className="list-disc list-inside text-gray-600">
                {packageData.dayDescriptions.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Place the Book Package Button at the bottom */}
          <div className="px-6 py-4 bg-gray-100">
            <button
              onClick={() =>handleBookPackage(packageData._id)}
              className="w-full py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
            >
              Book the Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;
