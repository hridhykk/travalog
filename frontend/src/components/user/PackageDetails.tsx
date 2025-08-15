import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SimilarPackageSlider from "./SimilarPackageSlider";

interface PackageData {
  _id: string;
  packageName?: string;
  companyName?: string;
  PackageType?: string;
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

interface PackageDetailsResponse {
  status: string;
  data: PackageData;
}

const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PackageDetailsResponse>(
          `http://localhost:5000/vendor/fetchpackage`,
          { params: { id } }
        );

        const fetchedData = response.data.data;
        setPackageData(fetchedData);
        console.log("Fetched package data:", fetchedData);
        if (fetchedData.images.length > 0) {
          setCurrentImage(fetchedData.images[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching package details:", err);
        setError("Could not load package details. Please try again later.");
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleBookPackage = (id: string) => {
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
    <div className="container mx-auto px-4 py-10">


      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img
            src={currentImage}
            alt="Package"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Add thumbnails if multiple images */}
          <div className="flex mt-2 gap-2">
            {packageData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-20 h-20 object-cover cursor-pointer border ${currentImage === img ? "border-blue-500" : "border-gray-300"}`}
                onClick={() => setCurrentImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{packageData.packageName}</h1>
          <p className="mb-2"><strong>Company:</strong> {packageData.companyName}</p>
          <p className="mb-2"><strong>Venue:</strong> {packageData.venue}</p>
          <p className="mb-2"><strong>Price:</strong> ₹{packageData.price}</p>
          <p className="mb-2"><strong>Duration:</strong> {packageData.duration}</p>
          <p className="mb-4 text-justify"><strong>Description:</strong> {packageData.packageDescription}</p>

          <button
            onClick={() => handleBookPackage(packageData._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Book Now
          </button>
        </div>
      </div>
      <div>
        <div className="md:flex md:space-x-20">
          <div>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Inclusions</h2>
            <ul className="list-disc pl-5 mb-6">
              {packageData.inclusion.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>


          </div>
          <div>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Exclusions</h2>
            <ul className="list-disc pl-5 mb-6">
              {packageData.exclusion.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>
          </div>

        </div>

        <h2 className="text-2xl font-semibold mb-4">Day-wise Itinerary</h2>
        {packageData.dayDescriptions.map((dayDesc, index) => (
          <div key={index} className="mb-4">
            
            <p className="text-justify">{dayDesc}</p>
          </div>
        ))}
      </div>
      <SimilarPackageSlider packageType={packageData.PackageType || ""} _id={packageData._id} />
    </div>
    
  );
};

export default PackageDetailsPage;
