import React, { useState, useEffect } from "react";
import axios from "axios";
import { showToastMessage } from "../../validation/Toast";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
// import { Modal, ModalHeader, ModalBody, ModalFooter,ModalContent, Button } from "../../components/admin/common/Modal";
import { Spinner, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
interface Package {
  _id: string;
  packageName: string;
  companyName: string;
  venue: string;
  price: string | number;
  duration: string;
  inclusion: string[];
  exclusion: string[];
  packageDescription: string;
  dayDescriptions: string[];
  images: string[];
  is_blocked: boolean;
  isVerified: boolean;
}

const PackageManagement = () => {
  const [packageData, setPackageData] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // Delay of 500ms for debouncing

    return () => clearTimeout(timer); // Cleanup timer
  }, [searchTerm]);
  

  // Fetch all packages directly from backend when the component mounts
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/admin/fetchpackages", {
          params: {
            page,
            limit: 4,
            searchTerm: debouncedSearch || undefined, // Include search term only if present
          },
        });

        setPackageData(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching packages:", error);
        showToastMessage("Failed to fetch packages", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [page, debouncedSearch]);

  // Handle block/unblock functionality
  const handleBlockStatus = async (packageId: string, currentBlockStatus: boolean) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${currentBlockStatus ? "unblock" : "block"} this package?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: currentBlockStatus ? "#10B981" : "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: currentBlockStatus ? "Yes, unblock!" : "Yes, block!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Send the API request to update package block status
        const response = await axios.patch(
          `http://localhost:5000/admin/blockpackages`,
          {
            is_blocked: !currentBlockStatus, 
          },
          {
            params: { packageId}, 
          }
        );
        
    
        console.log("Response:", response.data);
        
        // Update the package list locally
        setPackageData(prevState =>
          prevState.map(pkg =>
            pkg._id === packageId ? { ...pkg, is_blocked: !currentBlockStatus } : pkg
          )
        );

        showToastMessage(`Package ${currentBlockStatus ? "unblocked" : "blocked"} successfully`, "success");
      }
    } catch (error) {
      console.error("Error updating package status:", error);
      showToastMessage("Failed to update package status", "error");
    }
  };


  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle verification status functionality
  const handleVerificationStatus = async (packageId: string, isVerified: boolean) => {
    if (isVerified) {
      return; // Don't allow changes to verified status
    }

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to verify this package?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, verify!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Send the API request to update package verification status
        await axios.patch(`http://localhost:5000/admin/verifypackage`, null, {
          params: { packageId }, // Send packageId as query parameters
        });
        
       
        // Update the package list locally
        setPackageData(prevState =>
          prevState.map(pkg =>
            pkg._id === packageId ? { ...pkg, is_Verified: true, is_blocked: false } : pkg
          )
        );

        showToastMessage("Package verified successfully", "success");
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
      showToastMessage("Failed to verify package", "error");
    }
  };

  // Handle modal open/close
  const toggleModal = (packageItem: Package | null) => {
    setSelectedPackage(packageItem);
    setShowModal(!showModal);
  };

  // Handle search by venue name
  const filteredPackages = packageData.filter(pkg =>
    pkg.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-grow flex-col min-h-screen p-4">
      <ToastContainer />

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Package Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {/* Package Table */}
      <div className="overflow-x-auto mt-4">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2">Package Name</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Venue</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
              <th className="px-4 py-2">Verified</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg) => (
              <tr key={pkg._id} className="bg-white hover:bg-gray-50">
                <td className="border px-4 py-2">{pkg.packageName}</td>
                <td className="border px-4 py-2">{pkg.companyName}</td>
                <td className="border px-4 py-2">{pkg.venue}</td>
                <td className="border px-4 py-2">₹{pkg.price}</td>
                <td className="border px-4 py-2">
                  {pkg.is_blocked ? "Blocked" : "Active"}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleBlockStatus(pkg._id, pkg.is_blocked)}
                      className={`${
                        pkg.is_blocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      } text-white px-4 py-1 rounded transition-colors`}
                      disabled={loading}
                    >
                      {pkg.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleVerificationStatus(pkg._id, pkg.isVerified)}
                    className={`px-4 py-1 rounded transition-colors ${
                      pkg.isVerified
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                    disabled={pkg.isVerified || loading}
                  >
                    {pkg.isVerified ? "Verified" : "Verify"}
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => toggleModal(pkg)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                  >
                    &#8230;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
      {/* Modal */}
      <Modal
  isOpen={showModal}
  onClose={() => toggleModal(null)}
  size="2xl"
  scrollBehavior="inside"
  backdrop="blur"
  classNames={{
    backdrop: "bg-black/50 backdrop-blur-sm",
    base: "bg-gray-100/80 border-gray-200 rounded-xl",
    body: "p-6 rounded-xl",
    header: "border-b-[8px] border-gray-200 rounded-xl",
    footer: "border-t-[1px] border-gray-200 rounded-xl",
    closeButton: "hover:bg-gray-100/80",
  }}
>
  <ModalContent>
    <ModalHeader>
      <h3 className="text-lg font-semibold">Package Details</h3>
    </ModalHeader>
    <ModalBody>
      {selectedPackage && (
        <div className="space-y-4">
          {/* Package Images */}
          <div>
            <h4 className="font-semibold">Images</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedPackage.images.length > 0 ? (
                selectedPackage.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Package image ${index + 1}`}
                    className="w-full h-64 object-cover object-center rounded-lg"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No images available</p>
              )}
            </div>
          </div>

          {/* Package Details */}
          <p>
            <span className="font-medium">Package Name:</span> {selectedPackage.packageName}
          </p>
          <p>
            <span className="font-medium">Company:</span> {selectedPackage.companyName}
          </p>
          <p>
            <span className="font-medium">Venue:</span> {selectedPackage.venue}
          </p>
          <p>
            <span className="font-medium">Price:</span> ₹{selectedPackage.price}
          </p>
          <p>
            <span className="font-medium">Description:</span> {selectedPackage.packageDescription}
          </p>

          {/* Inclusions */}
          <div>
            <h4 className="font-semibold">Inclusions:</h4>
            <ul className="list-disc pl-5">
              {selectedPackage.inclusion.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div>
            <h4 className="font-semibold">Exclusions:</h4>
            <ul className="list-disc pl-5">
              {selectedPackage.exclusion.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Day Descriptions */}
          <div>
            <h4 className="font-semibold">Day Descriptions:</h4>
            <ul className="list-disc pl-5">
              {selectedPackage.dayDescriptions.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onPress={() => toggleModal(null)}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>


    </div>
  );
};

export default PackageManagement;
