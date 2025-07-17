import React from 'react';
import Header from '../../components/user/common/commonHeader';
import PopularTrips from '../../components/user/Trips';
import Footer from '../../components/user/common/Footer';

const TripPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-16"> {/* Add top padding to account for fixed header */}
        <PopularTrips />
      </main>
      <Footer />
    </div>
  );
};

export default TripPage;