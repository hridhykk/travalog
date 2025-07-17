import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Spinner, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface IAvailableAndBookedDate {
  date: string; // ISO date string
  maximumAllowedPackages: number;
  numberOfPackagesBookedByUser: number;
}

interface Package {
  _id: string;
  packageName: string;
  availableAndBookedDates?: IAvailableAndBookedDate[];
  maxPackagesPerDay?: number;
}

const SlotManagement = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState<"SET_UNAVAILABLE" | "INCREASE_PACKAGES" | null>(null);
  const vendorId = useSelector((state: RootState) => state.vendor.vendor?._id);
  // Fetch packages from backend
  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Package[]>(`http://localhost:5000/vendor/fetchpackages`, {
        params: { vendorId },
      });
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update a slot
  const updateSlot = async (packageId: string, updateData: Partial<IAvailableAndBookedDate>) => {
    try {
      await axios.put("http://localhost:5000/vendor/updateslot", {
        packageId,
        ...updateData,
      });
      alert("Slot updated successfully.");
      fetchPackages();
    } catch (error) {
      console.error("Error updating slot:", error);
    }
  };

  // Handle modal open
  const handleOpenModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setSelectedDate(null);
    setActionMode(null);
    setIsModalOpen(true);
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const today = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    if (date <= today) {
      alert("Cannot update slots for past or current dates.");
      return;
    }

    setSelectedDate(formattedDate);
  };
  const decrementDate = (dateString: string) => {
    const date = new Date(dateString); // Convert the string to a Date object
    date.setDate(date.getDate() - 1); // Subtract one day
    return date.toISOString().split("T")[0]; // Convert back to 'YYYY-MM-DD'
  };
  
  // Get tile CSS class name
  const getTileClassName = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const today = new Date();
    if (date <= today) return "bg-gray-400"; // Past or current dates

    const currentDateInfo = selectedPackage?.availableAndBookedDates.find(
      (slot) => decrementDate(slot.date) === formattedDate
    );

    if (!currentDateInfo) return "bg-gray-200"; // Available dates with no bookings

    if (currentDateInfo.maximumAllowedPackages === 0) return "bg-red-500"; // Unavailable
    if (currentDateInfo.maximumAllowedPackages === currentDateInfo.numberOfPackagesBookedByUser)
      return "bg-green-500"; // Fully booked
    return "bg-gray-200"; // Default available
  };

  // Handle action based on mode
  const handleAction = () => {
    if (!selectedDate || !selectedPackage) return;
  
    // Increment the selected date by one day
    const incrementedDate = new Date(selectedDate);
    incrementedDate.setDate(incrementedDate.getDate() + 1);
    const updatedDate = incrementedDate.toISOString().split("T")[0];
  
    if (actionMode === "SET_UNAVAILABLE") {
      updateSlot(selectedPackage._id, {
        date: updatedDate,
        maximumAllowedPackages: 0,
        //numberOfPackagesBookedByUser: 0,
      });
    } else if (actionMode === "INCREASE_PACKAGES") {
      const extraSlots = prompt("Enter the number of extra slots for this date:");
      if (extraSlots ) {
        updateSlot(selectedPackage._id, {
          date: updatedDate,
          maximumAllowedPackages: parseInt(extraSlots, 10),
        });
      } else {
        alert("Cannot set this package as unavailable.");
      }
    }
  
     setIsModalOpen(false);
  };
  

  useEffect(() => {
    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner label="Loading packages..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Slots for Packages</h1>
      {packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="border shadow-lg rounded-lg p-4 bg-white">
              <h3 className="text-lg font-semibold">{pkg.packageName}</h3>
              <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => handleOpenModal(pkg)}
              >
                Manage Slots
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Slot Update Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
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
         }}>
        <ModalContent>
          <ModalHeader>Manage Slot Availability</ModalHeader>
          <ModalBody>
            {selectedPackage ? (
              <>
                <div className="flex gap-4 mb-4">
                  <Button color="warning" onClick={() => setActionMode("SET_UNAVAILABLE")}>
                    Mark as Unavailable
                  </Button>
                  <Button color="primary" onClick={() => setActionMode("INCREASE_PACKAGES")}>
                  Manage Slot Availability
                  </Button>
                </div>
                <Calendar
                  onClickDay={handleDateClick}
                  tileClassName={getTileClassName}
                  selectRange={false}
                  showNeighboringMonth={false}
                />
              </>
            ) : (
              <p>Loading calendar...</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            {actionMode && (
              <Button color="primary" onClick={handleAction}>
                Save Changes
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SlotManagement;
