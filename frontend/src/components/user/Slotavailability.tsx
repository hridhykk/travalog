import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { showToastMessage } from '../../validation/Toast';
import {
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

declare var Razorpay: any;

interface PackageData {
  _id: string;
  packageName: string;
  price: number;
  description: string;
  images: string[];
  companyName: string;
  venue: string;
  duration: string;
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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [numPeople, setNumPeople] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const navigate = useNavigate();
  const userid = useSelector((state: RootState) => state.auth.user?._id);

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

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
  };

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setNumPeople(value);
    } else {
      alert("Number of people must be at least 1.");
    }
  };

  const handleCheckAvailability = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const today = dayjs().startOf('day');
    const tomorrow = today.add(1, 'day');

    if (selectedDate.isBefore(tomorrow)) {
      alert("Booking for the current date is not allowed. Please select a future date.");
      return;
    }

    const requestData = {
      packageId: packageData?._id || "No package ID",
      date: selectedDate.format('YYYY-MM-DD'),
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
        setIsPaymentRequired(true);
        setShowModal(true);
      } else {
        showToastMessage(response.data.message, 'error');
      }

      setLoading(false);
    } catch (err) {
      console.error("Error checking availability:", err);
      alert("Could not check availability. Please try again.");
    }
  };

  const handlePayment = async () => {
    const amount = packageData?.price * numPeople * 100;
    const orderData = {
      amount,
      packageId: packageData?._id,
      date: selectedDate?.format('YYYY-MM-DD'),
      numPeople,
      packageName: packageData?.packageName,
    };

    try {
      const response = await axios.post("http://localhost:5000/user/create-order", orderData);
      const { id: orderId, amount: razorpayAmount } = response.data;

      const options = {
        key: "rzp_test_NR9eOBPU6D0pr4",
        amount: razorpayAmount,
        currency: "INR",
        order_id: orderId,
        description: packageData?.packageName,
        handler: async (response: any) => {
          try {
            const paymentData = {
              orderId: response.razorpay_order_id,
              userId: userid,
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
              showToastMessage("Your booking is confirmed!", "success");
              navigate('/user/trips');
            } else {
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

  if (loading) return <Spinner size="lg" />;
  if (error) return <div>Error: {error}</div>;
  if (!packageData) return null;

  return (
    <div className="container p-20">
      <h1 className="pb-10 text-center font-bold">Book Your Package</h1>
      <div className=" md:flex mx-auto  justify-center gap-28">

        <div className="flex flex-col items-center md:items-start">
          <img className="w-[400px] pb-10" src={packageData.images[0]} alt="" />
          <h2 className="text-2xl font-bold mb-4">{packageData.packageName}</h2>
          <div className="flex gap-7">
            <div>
              <p className="mb-2"><strong>Company:</strong> {packageData.companyName}</p>
              <p className="mb-2"><strong>Venue:</strong> {packageData.venue}</p>
            </div>
            <div>
              <p className="mb-2"><strong>Price:</strong> ₹{packageData.price}</p>
              <p className="mb-2"><strong>Duration:</strong> {packageData.duration}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-0 flex flex-col items-center md:items-start">
          <div className="mb-4 w-full bg-white rounded-md shadow p-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate}
                onChange={handleDateChange}
                minDate={dayjs().add(1, 'day')}
                slots={{
                  actionBar: () => null
                }}
              />
            </LocalizationProvider>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <label htmlFor="numPeople" className="block mb-1 font-medium">
              Number of People:
            </label>
            <input
              id="numPeople"
              type="number"
              className="border border-gray-300 rounded-md p-2 w-1/3"
              value={numPeople.toString()}
              onChange={handlePeopleChange}
              min={packageData?.minPersons ?? 1}
              max={packageData?.maxPersons ?? 100}
            />
          </div>

          <div className="flex flex-col items-end ">
            {isPaymentRequired ? (
              <Button onClick={handlePayment} variant="contained">Pay Now</Button>
            ) : (
              <Button onClick={handleCheckAvailability} variant="contained">Check Availability</Button>
            )}

            <Modal open={showModal} onClose={() => setShowModal(false)} width="600px">
              <ModalContent>
                <ModalHeader>
                  <h3>{packageData.packageName}</h3>
                </ModalHeader>
                <ModalBody>
                  <p>Date: {selectedDate?.format('DD/MM/YYYY')}</p>
                  <p>Number of people: {numPeople}</p>
                  <p className="text-lg font-bold">
                    Total: ₹ {(packageData.price * numPeople).toLocaleString()}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outlined" color="error" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="success" onClick={handlePayment}>
                    Confirm Booking
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <p className="text-gray-500 text-sm max-w-[400px] mt-4 text-center">
              Free cancellation up to 24 hours before the experience starts (local time).
            </p>
          </div>

        </div>
      </div>
    </div>

  );
};

export default BaliPackage;
