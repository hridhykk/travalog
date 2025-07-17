

//import React from 'react'
import Sidebar from "../../components/admin/common/Sidebar";
import BookedDetails from '../../components/admin/BookedDetails'
function AdminBookedDetails() {
  return (
    <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex-1 overflow-auto">
      <BookedDetails/>
    </div>
  </div>
  )
}

export default AdminBookedDetails