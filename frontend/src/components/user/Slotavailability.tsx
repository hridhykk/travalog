import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { showToastMessage } from '../../validation/Toast'
import {
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useParams } from "react-router-dom";
declare var Razorpay: any;  // Add this declaration
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


interface PackageData {
  _id: string;
  packageName: string;
  price: number;
  description: string;
  availableAndBookedDates: {
    date: string;
    maximumAllowedPackages: number;
    numberOfPackagesBookedByUser: number;
  }[];
  maxPersons: number;
  minPersons: number;
}

const BaliPackage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [numPeople, setNumPeople] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const navigate = useNavigate();
  const userid = useSelector((state: RootState) => state.auth.user?._id);
  // Fetch package details on component mount
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ data: PackageData }>(
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

  // Handle changes to the selected date
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle changes to the number of people input
  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setNumPeople(value);
    } else {
      alert("Number of people must be at least 1.");
    }
  };

  // Handle the availability check
  const handleCheckAvailability = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (selectedDate <= tomorrow) {
      alert("Booking for the current date is not allowed. Please select a future date.");
      return;
    }

    const requestData = {
      packageId: packageData?._id || "No package ID",
      date: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      numPeople,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:5000/vendor/checkavilability`,
        requestData
      );
      if (response.data.status === 'success') {
        showToastMessage(response.data.message, 'success');
        setIsPaymentRequired(true); // After availability, show the Pay Now button
        setShowModal(true); // Show the booking details modal
      } else {
        showToastMessage(response.data.message, 'error');
      }

      setLoading(false);
    } catch (err) {
      console.error("Error checking availability:", err);
      alert("Could not check availability. Please try again.");
    }
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    const amount = packageData?.price * numPeople * 100; // Razorpay requires amount in paise (100 = ₹1)
    const orderData = {
      amount,
      packageId: packageData?._id,
      date: selectedDate?.toISOString().slice(0, 10),
      numPeople,
      packageName: packageData?.packageName,
    };
  
    try {
      // Fetch Razorpay order details from the backend
      const response = await axios.post("http://localhost:5000/user/create-order", orderData);
      const { id: orderId, amount: razorpayAmount } = response.data;
  
      const options = {
        key: "rzp_test_NR9eOBPU6D0pr4", // Replace with your Razorpay key
        amount: razorpayAmount, // Amount in paise
        currency: "INR",
        order_id: orderId,
        description: packageData?.packageName,
        handler: async (response: any) => {
          console.log("Payment Success: ", response);
          
  
          // Send payment data to backend for storing in DB
          try {
            const paymentData = {
              orderId: response.razorpay_order_id,
              userId:userid,
              paymentId: response.razorpay_payment_id,
              amount: orderData.amount,
              bookedDate: orderData.date,
              numPeople: orderData.numPeople,
              packageId: orderData.packageId,
              packageName: orderData.packageName,
            };
  
            const paymentVerificationResponse = await axios.post(
              "http://localhost:5000/user/createbooking",
              paymentData
            );
           
            if (paymentVerificationResponse.data.status === "success") {
              console.log("Booking stored in DB");
              showToastMessage("Your booking is confirmed!", "success");
              navigate('/user/trips')
            } else {
              console.log("Payment verification failed:", paymentVerificationResponse.data.message);
              showToastMessage("Payment verification failed. Please try again.", "error");
            }
          } catch (err) {
            console.error("Error storing payment data:", err);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      showToastMessage("Error creating order. Please try again.", "error");
    }
  };
  
  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!packageData) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="bg-white rounded-lg shadow-md p-6"
        style={{
          width: "50%",
        }}
      >
        <h2 className="text-2xl font-bold mb-4">{packageData.packageName}</h2>
        <p className="text-green-500 text-2xl font-bold mb-4">
          From ₹ {packageData.price.toLocaleString()} per person
        </p>

        <div className="mb-4">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate || new Date()}
            minDate={new Date()}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="numPeople" className="block mb-1 font-medium">
            Number of People
          </label>
          <input
            id="numPeople"
            type="number"
            className="border border-gray-300 rounded-md p-2 w-1/3"
            value={numPeople.toString()}
            onChange={handlePeopleChange}
            min={1}
          />
        </div>

        <div className="flex justify-center">
          {isPaymentRequired ? (
            <Button
              color="success"
              onClick={handlePayment}
              style={{
                width: "120px",
                height: "40px",
              }}
            >
              Pay Now
            </Button>
          ) : (
            <Button
              color="success"
              onClick={handleCheckAvailability}
              style={{
                width: "120px",
                height: "40px",
              }}
            >
              Check Availability
            </Button>
          )}
        </div>

        <Modal open={showModal} onClose={() => setShowModal(false)} width="600px">
          <ModalContent>
            <ModalHeader>
              <h3>{packageData.packageName}</h3>
            </ModalHeader>
            <ModalBody>
              <p>Date: {selectedDate?.toLocaleDateString()}</p>
              <p>Number of people: {numPeople}</p>
              <p className="text-lg font-bold">
                Total: ₹ {(packageData.price * numPeople).toLocaleString()}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button auto onClick={handlePayment}>
                Confirm Booking
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <p className="text-gray-500 text-sm mt-4">
          Free cancellation up to 24 hours before the experience starts (local
          time).
        </p>
      </div>
    </div>
  );
};

export default BaliPackage;
