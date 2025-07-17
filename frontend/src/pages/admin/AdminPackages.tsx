
//import React from 'react'
import Sidebar from "../../components/admin/common/Sidebar";
import Package from '../../components/admin/Package'
function AdminPackages() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Package/>
      </div>
    </div>
  )
}

export default AdminPackages