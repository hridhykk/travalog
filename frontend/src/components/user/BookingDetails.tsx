import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, Card, Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const MySwal = withReactContent(Swal);

type BookingData = {
  orderId: string;
  paymentId: string;
  amount: number;
  numPeople: number;
  packageId: string;
  packageName: string;
  paymentStatus: string;
  isVerified: boolean;
  isBlocked: boolean;
  cancelled: boolean;
  bookedDate: string;
  createdAt: string;
  updatedAt: string;
};

const BookingDetails: React.FC = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewText, setReviewText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [submittingReviewFor, setSubmittingReviewFor] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/fetchbookingdetails`, {
        params: { userId },
      });
      setBookings(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      setLoading(false);
    }
  };

  const handleCancelTrip = async (orderId: string, bookedDate: string) => {
    const bookedDateObj = new Date(bookedDate);
    const today = new Date();
    const diffDays = (bookedDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays <= 2) {
      toast.error("You can't cancel the trip less than two days before the booked date.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/user/cancelBooking`, {
        params: { orderId },
      });

      if (response.data.status === 'success') {
        toast.success('Your booking has been successfully canceled.');
        fetchBookingDetails();
      } else {
        toast.error('Failed to cancel the booking. Please try again.');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error('An error occurred while canceling the booking.');
    }
  };

  const showCancelConfirmation = (orderId: string, bookedDate: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel the trip?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelTrip(orderId, bookedDate);
      }
    });
  };

  const handleReviewSubmit = async (booking: BookingData) => {
    if (rating < 1 || rating > 5 || !reviewText.trim()) {
      toast.error("Please enter a rating (1-5) and a review.");
      return;
    }

    try {
      setSubmittingReviewFor(booking.orderId);

      const payload = {
        userId,
        packageId: booking.packageId,
        vendorId: 'your-vendor-id', // Ideally get this from booking details
        rating,
        comment: reviewText
      };

      const response = await axios.post('http://localhost:5000/user/add-review', payload);

      if (response.data.status === 'success') {
        toast.success("Thank you for your review!");
        setReviewText('');
        setRating(0);
      } else {
        toast.error("Failed to submit your review.");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("An error occurred while submitting your review.");
    } finally {
      setSubmittingReviewFor(null);
    }
  };

  const hasTripPassed = (dateStr: string) => {
    const tripDate = new Date(dateStr);
    const today = new Date();
    return tripDate < today;
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-12 mt-12">
      {bookings.filter(b => !b.cancelled).length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-xl font-bold">No booking details available.....</p>
        </div>
      ) : (
        bookings
          .filter(b => !b.cancelled)
          .map((booking) => {
            const isPastTrip = hasTripPassed(booking.bookedDate);

            return (
              <Card key={booking.orderId} className="shadow-lg border border-gray-300 rounded-md p-6 mb-10">
                <h2 className="text-2xl font-bold text-center mb-6">Booking Confirmed</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Booking Details</h3>
                    <p><strong>Package Name:</strong> {booking.packageName}</p>
                    <p><strong>Order ID:</strong> {booking.orderId}</p>
                    <p><strong>Check-in Date:</strong> {new Date(booking.bookedDate).toLocaleDateString()}</p>
                    <p><strong>Number of People:</strong> {booking.numPeople}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Payment Details</h3>
                    <p><strong>Payment ID:</strong> {booking.paymentId}</p>
                    <p><strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> ₹{booking.amount }</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  {!isPastTrip && (
                    <Button color="danger" onClick={() => showCancelConfirmation(booking.orderId, booking.bookedDate)} auto>
                      Cancel Booking
                    </Button>
                  )}
                </div>

                {/* Review Section */}
                {isPastTrip && (
                  <div className="mt-10 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="number"
                        label="Rating (1-5)"
                        min={1}
                        max={5}
                        value={rating.toString()}
                        onChange={(e) => setRating(Number(e.target.value))}
                      />
                      <Textarea
                        label="Your review"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                    </div>
                    <Button
                      className="mt-4"
                      color="primary"
                      onClick={() => handleReviewSubmit(booking)}
                      isLoading={submittingReviewFor === booking.orderId}
                    >
                      Submit Review
                    </Button>
                  </div>
                )}
              </Card>
            );
          })
      )}
    </div>
  );
};

export default BookingDetails;
