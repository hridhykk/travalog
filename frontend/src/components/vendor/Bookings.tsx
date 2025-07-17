import { Button, Card } from '@nextui-org/react';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
 
import axios from "axios";

function Bookings() {
 const [currentPage, setCurrentPage] = useState<number>(1);
 const itemsPerPage = 4;
  const vendorId = useSelector((state: RootState) => state.vendor.vendor?._id);

   const fetchPackages = async (page: number = 1) => {
   
      try {
        const response = await axios.get<{ data: any[]; totalPages: number }>(
          `http://localhost:5000/vendor/fetchbookings`,
          {
            params: { vendorId, page, limit: itemsPerPage },
          }
        );
    
        // Update packages and pagination
       console.log(response.data)
    
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        
      }
    };
  
      
    useEffect(() => {
     
      fetchPackages(currentPage);
    }, []);
  return (
    <div className="flex w-full justify-center items-start p-12 mt-[85px]  ">

     <Card className="shadow-lg border  border-gray-300 rounded-md p-6 mb-6">
  <h2 className="text-2xl font-bold text-center mb-6">Booking Confirmed</h2>
  <div className="grid grid-cols-2 gap-6">
       <p><strong>Package Name:</strong> hridhya</p>
                <p><strong>Order ID:</strong>7843847934948798457984598</p>
                <p><strong>Check-in Date:</strong>14/12/200 </p>
                <p><strong>Number of People:</strong></p>
  </div>
     </Card>
    </div>
  )
}

export default Bookings