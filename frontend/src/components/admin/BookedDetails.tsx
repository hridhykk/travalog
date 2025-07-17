import React, { useState, useEffect } from "react";
import axios from "axios";
import { showToastMessage } from "../../validation/Toast";
import { ToastContainer } from "react-toastify";

interface BookedDetail {
  _id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  numPeople: number;
  packageName: string;
  paymentStatus: string;
  bookedDate: string;
  createdAt: string;
}

const BookedDetails = () => {
  const [bookedDetails, setBookedDetails] = useState<BookedDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch booked details from backend
  useEffect(() => {
    const fetchBookedDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get<BookedDetail[]>("http://localhost:5000/admin/fetchbookeddetails");
        setBookedDetails(response.data.data); // Ensure your backend API response structure matches
      } catch (error) {
        console.error("Error fetching booked details:", error);
        showToastMessage("Failed to fetch booked details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDetails();
  }, []);

  // Filter booked details by package name
  const filteredBookedDetails = bookedDetails.filter(detail =>
    detail.packageName.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Booked Details Table */}
      <div className="overflow-x-auto mt-4">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">Package Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Number of People</th>
              <th className="px-4 py-2">Payment Status</th>
              <th className="px-4 py-2">Booked Date</th>
              <th className="px-4 py-2">Booked  At</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookedDetails.map((detail) => (
              <tr key={detail._id} className="bg-white hover:bg-gray-50">
                <td className="border px-4 py-2">{detail.orderId}</td>
                <td className="border px-4 py-2">{detail.paymentId}</td>
                <td className="border px-4 py-2">{detail.packageName}</td>
                <td className="border px-4 py-2">₹{detail.amount / 100}</td>
                <td className="border px-4 py-2">{detail.numPeople}</td>
                <td className="border px-4 py-2">{detail.paymentStatus}</td>
                <td className="border px-4 py-2">{new Date(detail.bookedDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(detail.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookedDetails;
