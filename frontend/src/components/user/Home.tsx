import Footer from './common/Footer';
import { useState, useEffect } from 'react';
import { User, Tag, ShieldCheck } from 'lucide-react';
import Header from './common/commonHeader';
import { motion, AnimatePresence } from "framer-motion"
const heroDetails = [{
  id: 0,
  title: "KERALA",
  location: "kerala",
  discribtion: "Kerala, a state on India's tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline. It's known for its palm-lined beaches and backwaters, a network of canals.",
  cardImg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752942930/meric-dagli-k-ejtalL1Ik-unsplash_j0igo7.jpg",
  heroimg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752938725/dream-holidays-Jqc2nOH3u3Y-unsplash_iupnii.jpg"
}, {
  id: 1,
  title: "INDONESIA",
  location: "indonesia",
  discribtion: "a;alkfv alkfjj adf ;lkj khjg;lkhalkfja;l;f sfja; lsfas djf;lashflknlkahsllkfaksfsjfpodhgla;snfla asdf akshpashfkasnclkasdfjh",
  cardImg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943130/steve-douglas-ioJVccFmWxE-unsplash_k4g0zx.jpg",
  heroimg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943050/melvin-tan-VO1EisKqdEE-unsplash_qhxt5v.jpg"
}, {
  id: 2,
  title: "BALI",
  location: "bali",
  discribtion: "a;alkfv alkfjj adf ;lkj khjg;lkhalkfja;l;f sfja; lsfas djf;lashflknlkahsllkfaksfsjfpodhgla;snfla asdf akshpashfkasnclkasdfjh",
  cardImg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943309/felfin-felfin-XvFfPTSP2gA-unsplash_sxq4kl.jpg",
  heroimg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943664/photo-1733281120650-b6898966f797_nq0hgl.jpg"
}, {
  id: 3,
  title: "VIETNAM",
  location: "vietnam",
  discribtion: "a;alkfv alkfjj adf ;lkj khjg;lkhalkfja;l;f sfja; lsfas djf;lashflknlkahsllkfaksfsjfpodhgla;snfla asdf akshpashfkasnclkasdfjh",
  cardImg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752944025/photo-1741320159899-df923b71de08_jvo3yr.jpg",
  heroimg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752947944/photo-1746254919832-84f80c6ec9b0_ssubmm.jpg"
}, {
  id: 4,
  title: "SRILANKA",
  location: "srilanka",
  discribtion: "a;alkfv alkfjj adf ;lkj khjg;lkhalkfja;l;f sfja; lsfas djf;lashflknlkahsllkfaksfsjfpodhgla;snfla asdf akshpashfkasnclkasdfjh",
  cardImg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752944305/jannes-jacobs-8x3mdrB3x5A-unsplash_vy4csk.jpg",
  heroimg: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752944307/yasintha-perera-oMgtkpr3Cpg-unsplash_rai6or.jpg"
}]
const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  // Cycle every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {

      setTextVisible(false);


      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroDetails.length);
      }, 700);


      setTimeout(() => {
        setTextVisible(true);
      }, 700 + 1200);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentData = heroDetails[currentIndex];
  console.log("Updated file loaded!");
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>





        <div id="hero" className="relative h-screen overflow-hidden">
          {/* Background Images (Crossfade) */}
          <div className="absolute inset-0">
            {heroDetails.map((item, index) => (
              <motion.img
                key={item.id}
                src={item.heroimg}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentIndex === index ? 1 : 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Text Layer */}
          <div className="absolute left-28 top-1/2 -translate-y-1/2 text-white z-10">
            <AnimatePresence>
              {textVisible && (
                <>
                  <motion.h1
                    key={heroDetails[currentIndex].title}
                    className="font-bold text-7xl mb-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    {heroDetails[currentIndex].title}
                  </motion.h1>

                  <motion.p
                    key={heroDetails[currentIndex].discribtion}
                    className="max-w-md text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: "easeInOut", delay: 0.1 }}
                  >
                    {heroDetails[currentIndex].discribtion}
                  </motion.p>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>


        <div className="bg-grey py-12 shadow-lg">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">

              {/* Handpicked Activities */}
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <User size={32} className="text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Handpicked Activities
                </h3>
                <p className="text-gray-600">
                  Explore the best experiences<br />
                  in your favourite cities
                </p>
              </div>

              {/* Lowest Prices */}
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <Tag size={32} className="text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Lowest Prices
                </h3>
                <p className="text-gray-600">
                  Guaranteed lowest prices.<br />
                  Anyday, everyday.
                </p>
              </div>

              {/* 100% Secure */}
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <ShieldCheck size={32} className="text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  100% Secure
                </h3>
                <p className="text-gray-600">
                  Every transaction is secure.<br />
                  Your money is safe
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Domestic Trips Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Domastic hell
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Goa", image: "/bg.jpeg", price: "999" },
              { title: "Manali", image: "/img4.jpeg", price: "1299" },
              { title: "Nepal", image: "/img5.jpeg", price: "1499" },
            ].map((trip, index) => (
              <div key={index} className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                  <p className="text-gray-600">Starting from ${trip.price}</p>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* International Trips Section */}
        <section className="container mx-auto py-16 px-4 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              INTERNATIONAL TRIPS
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "USA", image: "/img7.jpg", price: "1999" },
              { title: "Europe", image: "/img3.jpeg", price: "2499" },
              { title: "Paris", image: "/background.jpg", price: "2999" },
            ].map((trip, index) => (
              <div key={index} className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                <div className="relative overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                  <p className="text-gray-600">Starting from ${trip.price}</p>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;