import React, { useEffect, useState } from "react";
import { Spinner, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Swal from 'sweetalert2';

interface Package {
  _id: string;
  vendorId: string;
  packageName: string;
  companyName: string;
  venue: string;
  price: number;
  duration: string;
  inclusion: string[];
  exclusion: string[];
  packageDescription: string;
  dayDescriptions: string[];
  bookedDates: Date[];
  images: string[];
  maxPersons: number;
  minPersons: number;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const PackagesManagement: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [editPackageDetails, setEditPackageDetails] = useState<Package | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 4; // Set the number of items per page.

  const vendorId = useSelector((state: RootState) => state.vendor.vendor?._id);

  const fetchPackages = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ data: Package[]; totalPages: number }>(
        `http://localhost:5000/vendor/fetchpackages`,
        {
          params: { vendorId, page, limit: itemsPerPage },
        }
      );
  
      // Update packages and pagination
      setPackages(response.data.data);
      setFilteredPackages(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
  
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

    
  useEffect(() => {
    console.log(`Fetching page: ${currentPage}`);
    fetchPackages(currentPage);
  }, [currentPage]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = packages.filter((pkg) =>
      pkg.venue.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPackages(filtered);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="primary" />
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  

  const handleDelete = async (pkgId: string) => {
    try {
      // Show SweetAlert confirmation
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      });
  
      console.log(pkgId);
      alert(pkgId)
      // If the user confirms, proceed with deletion
    
        await axios.delete(`http://localhost:5000/vendor/deletePackage`,{
          params:{packageId:pkgId}
        });

        console.log(pkgId);
        alert(pkgId)
        //setPackages(packages.filter(pkg => pkg._id !== pkgId));

        // setFilteredPackages(filteredPackages.filter(pkg => pkg._id !== pkgId));
        Swal.fire('Deleted!', 'Your package has been deleted.', 'success');
     
    } catch (error) {
      console.error("Error deleting package:", error);
      Swal.fire('Failed!', 'There was an issue deleting the package.', 'error');
    }
  };
  
  
  
  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setEditPackageDetails({ ...pkg }); // Initialize the editing package details
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPackageDetails((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = async () => {
    if (editPackageDetails) {
      try {
        const response = await axios.put(
          `http://localhost:5000/vendor/updatePackage`,
          editPackageDetails
        );
        const updatedPackage = response.data;
        setPackages(packages.map((pkg) => (pkg._id === updatedPackage._id ? updatedPackage : pkg)));
        setFilteredPackages(
          filteredPackages.map((pkg) => (pkg._id === updatedPackage._id ? updatedPackage : pkg))
        );
        setEditingPackage(null);
        Swal.fire("Updated!", "Your package has been updated.", "success");
        fetchPackages(currentPage);
      } catch (error) {
        console.error("Error saving changes:", error);
        Swal.fire("Failed!", "There was an issue saving the package.", "error");
      }
    }
  };






  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow">
        <Input
          placeholder="Search by Venue"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          clearable
          className="w-full max-w-lg mx-auto"
        />
      </div>

      {/* Packages Grid */}
      <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 flex flex-col"
          >
            {/* Package Image */}
            {pkg.images.length > 0 ? (
              <img
                src={pkg.images[0]}  // Directly use the signed URL from the backend
                alt={pkg.packageName}
                className="w-full h-48 object-cover object-center"  // Cover image with centered object
              />
            ) : (
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600">
                No Image Available
              </div>
            )}

            {/* Package Info */}
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold text-gray-700">{pkg.packageName}</h3>
              <p className="text-sm text-gray-500 mb-1">{pkg.companyName}</p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Venue:</span> {pkg.venue}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Price:</span> ₹{pkg.price}
              </p>
            </div>

            {/* View Details and Edit Buttons */}
            <div className="p-4 bg-gray-50">
              <Button
                className="w-full"
                color="primary"
                onPress={() => setSelectedPackage(pkg)}
              >
                View Details
              </Button>
              <Button
                className="w-full mt-2"
                color="warning"
                onPress={() => handleEdit(pkg)}
              >
                Edit Package
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-6">
  <Button
    disabled={currentPage === 1} // Disable Prev button on the first page
    onClick={() => {
      if (currentPage >= 1) {
        setCurrentPage((prevPage) => prevPage - 1); // Decrement page number
      }
    }}
  >
    Prev
  </Button>
  <span className="text-lg font-medium">
    Page {currentPage} of {totalPages}
  </span>
  <Button
    disabled={currentPage === totalPages} // Disable Next button on the last page
    onClick={() => {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1); // Increment page number
      }
    }}
  >
    Next
  </Button>
</div>

      {/* View Details Modal */}
      {selectedPackage && (
        <Modal
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
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
              <h3 className="text-lg font-semibold">{selectedPackage.packageName}</h3>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold"></h4>
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
                <p>
                  <span className="font-medium">Description:</span> {selectedPackage.packageDescription}
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
                  <span className="font-medium">Duration:</span> {selectedPackage.duration}
                </p>
                <p>
                  <span className="font-medium">Max Persons:</span> {selectedPackage.maxPersons}
                </p>
                <p>
                  <span className="font-medium">Min Persons:</span> {selectedPackage.minPersons}
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
            </ModalBody>
            <ModalFooter>
              <Button color="success" onPress={() => setSelectedPackage(null)}>
                Close
              </Button>
              <Button
        color="danger"
        onPress={() =>
          selectedPackage?._id
            ? handleDelete(selectedPackage._id)
            : console.error("No package ID found!")
        }
        disabled={!selectedPackage?._id}
      >
        Delete Package
      </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Package Modal */}
      {editingPackage && (
        <Modal
  isOpen={!!editingPackage}
  onClose={() => setEditingPackage(null)}
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
      <h3 className="text-lg font-semibold">Edit Package: {editingPackage.packageName}</h3>
    </ModalHeader>
    <ModalBody>
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Package Name</label>
          <Input
            name="packageName"
            value={editPackageDetails?.packageName || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Company Name</label>
          <Input
            name="companyName"
            value={editPackageDetails?.companyName || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Venue</label>
          <Input
            name="venue"
            value={editPackageDetails?.venue || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Price</label>
          <Input
            name="price"
            type="number"
            value={editPackageDetails?.price || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Duration</label>
          <Input
            name="duration"
            value={editPackageDetails?.duration || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Inclusion</label>
          <Input
            name="inclusion"
            isMultiline
            value={editPackageDetails?.inclusion?.join(", ") || ""}
            onChange={handleChange}
            placeholder="Comma separated list"
          />
        </div>
        <div>
          <label className="font-semibold">Exclusion</label>
          <Input
            name="exclusion"
            isMultiline
            value={editPackageDetails?.exclusion?.join(", ") || ""}
            onChange={handleChange}
            placeholder="Comma separated list"
          />
        </div>
        <div>
          <label className="font-semibold">Package Description</label>
          <Input
            name="packageDescription"
            isMultiline
            value={editPackageDetails?.packageDescription || ""}
            onChange={handleChange}
            placeholder="Describe the package"
          />
        </div>
        <div>
          <label className="font-semibold">Max Persons</label>
          <Input
            name="maxPersons"
            type="number"
            value={editPackageDetails?.maxPersons || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Min Persons</label>
          <Input
            name="minPersons"
            type="number"
            value={editPackageDetails?.minPersons || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Day Descriptions</label>
          <Input
            name="dayDescriptions"
            isMultiline
            value={editPackageDetails?.dayDescriptions?.join(", ") || ""}
            onChange={handleChange}
            placeholder="Comma separated list of day activities"
          />
        </div>
        <div>
          <label className="font-semibold">Available & Booked Dates</label>
          <Input
            name="availableAndBookedDates"
            isMultiline
            value={editPackageDetails?.availableAndBookedDates?.map(date => `${date.date}: ${date.maximumAllowedPackages} max, ${date.numberOfPackagesBookedByUser} booked`).join("\n") || ""}
            onChange={handleChange}
            placeholder="Format: 2024-12-05: 4 max, 2 booked"
          />
        </div>
        <div>
          <label className="font-semibold">Images</label>
          <Input
            name="images"
            isMultiline
            value={editPackageDetails?.images?.join(", ") || ""}
            onChange={handleChange}
            placeholder="Comma separated image URLs"
          />
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onPress={() => setEditingPackage(null)}>
        Cancel
      </Button>
      <Button color="primary" onPress={handleSaveChanges}>
        Save Changes
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
      )}
    </div>
  );
};

export default PackagesManagement;
