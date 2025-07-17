import Header from '../../components/user/common/commonHeader';
import Footer from '../../components/user/common/Footer';
import PackageDetailsPage from '../../components/user/PackageDetails';

function PackageDetailspage() {
  return (
    <div>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Content with padding to avoid overlapping */}
      <div className="pt-[80px]"> {/* Adjust padding-top to match header height */}
        <PackageDetailsPage />
        <Footer />
      </div>
    </div>
  );
}

export default PackageDetailspage;
