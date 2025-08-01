




import Footer from './common/Footer';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from './common/commonHeader';
import PopularDestinationSlider from './PopularDestinationSlider';
import FilterSearch from './FilterSearch';
import PackageTypeGrid from './PackageTypeGrid';
import TrendingPackageSlider from './TrendingPackageSlider';
import Wustwu from './Wustwu';
import KeyMetrics from './KeyMetrics';
import { Button } from '@mui/material';


interface Trip {
  _id: string;
  venue: string;
  price: string;
  images: string[];
  duration: string;
  packageName: string;
  popularity: number;
}

interface TripResponse {
  status: string;
  data: Trip[];
}



const heroDetails = [
  {
    id: 0,
    title: "KERALA",
    location: "kerala",
    discribtion:
      "Kerala, a state on India's tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline.",
    cardImg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752942930/meric-dagli-k-ejtalL1Ik-unsplash_j0igo7.jpg",
    heroimg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752938725/dream-holidays-Jqc2nOH3u3Y-unsplash_iupnii.jpg",
  },
  {
    id: 1,
    title: "INDONESIA",
    location: "indonesia",
    discribtion:
      "Indonesia is a diverse country with thousands of islands, offering stunning beaches and rich culture.",
    cardImg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943130/steve-douglas-ioJVccFmWxE-unsplash_k4g0zx.jpg",
    heroimg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943050/melvin-tan-VO1EisKqdEE-unsplash_qhxt5v.jpg",
  },
  {
    id: 2,
    title: "BALI",
    location: "bali",
    discribtion:
      "Bali is a famous Indonesian island known for forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.",
    cardImg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943309/felfin-felfin-XvFfPTSP2gA-unsplash_sxq4kl.jpg",
    heroimg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752943664/photo-1733281120650-b6898966f797_nq0hgl.jpg",
  },
  {
    id: 3,
    title: "VIETNAM",
    location: "vietnam",
    discribtion:
      "Vietnam is known for its beaches, rivers, Buddhist pagodas, and bustling cities.",
    cardImg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752944025/photo-1741320159899-df923b71de08_jvo3yr.jpg",
    heroimg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752947944/photo-1746254919832-84f80c6ec9b0_ssubmm.jpg",
  },
  {
    id: 4,
    title: "SRILANKA",
    location: "srilanka",
    discribtion:
      "Sri Lanka is known for its ancient Buddhist ruins, including the 5th-century citadel Sigiriya.",
    cardImg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752944305/jannes-jacobs-8x3mdrB3x5A-unsplash_vy4csk.jpg",
    heroimg:
      "https://res.cloudinary.com/dsqeab5bm/image/upload/v1752944307/yasintha-perera-oMgtkpr3Cpg-unsplash_rai6or.jpg",
  },
];


const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TripResponse>("http://localhost:5000/vendor/fetchallpackages");
        setTrips(response.data.data);
        console.log("Fetched trips:", response.data.data);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips. Please try again later.");
        setLoading(false);
      }
    };
    fetchTrips();

  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroDetails.length);

    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (

    <div >
      <Header />

      <main>
        {/* Hero Section */}
        <div id="hero" className="relative h-[200px] sm:h-[300px] md:h-[350px] lg:h-[450px]  ">
          {/* Background Image */}
          <div className=" absolute top-0 bottom-0 left-0 right-0">
            <img
              src={heroDetails[currentIndex].heroimg}
              alt={heroDetails[currentIndex].title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
              style={{ willChange: "opacity" }}
              loading="lazy"
            />
            <div className="absolute left-14 md:left-44 top-1/2 -translate-y-1/2 text-white z-10 max-w-lg">
              <h1 className="font-bold text-xl md:text-5xl mb-2  transition-opacity duration-700">
                {heroDetails[currentIndex].title}
              </h1>
              {/* Hero Text */}
              <p className="hidden md:block max-w-md text-xs md:text-lg transition-opacity duration-700">
                {heroDetails[currentIndex].discribtion}
              </p>
              <Button
                variant="outlined"
                sx={{
                  display: {
                    xs: 'none',   // hidden on extra small
                    sm: 'inline-flex', // visible on medium and up
                  },
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'black',
                  },
                }}
              >
                Explore
              </Button>

            </div>
          </div>

          <FilterSearch />

        </div>

        {/*Spacer*/}
        <div className='w-full xl:h-[80px] md:h-[200px] h-[280px]' />

        <PopularDestinationSlider trips={trips} />

        <div>
          <PackageTypeGrid />
        </div>
        <TrendingPackageSlider trips={trips} />
        <Wustwu />
        <KeyMetrics />
        
      

      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
