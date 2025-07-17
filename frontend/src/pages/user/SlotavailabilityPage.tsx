

//import React from 'react'
import Header from '../../components/user/common/commonHeader';

import Footer from '../../components/user/common/Footer';
import BaliPackage from '../../components/user/Slotavailability'

function SlotavailabilityPage() {
  return (
    <div>
       <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      <div className="pt-[80px]"> {/* Adjust padding-top to match header height */}
      <BaliPackage/>
        <Footer />
      </div>
      
    </div>
  )
}

export default SlotavailabilityPage