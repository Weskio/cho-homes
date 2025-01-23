import { useState, useEffect, useRef } from 'react'
import { Link} from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { BiBuildingHouse } from 'react-icons/bi'
import PropertyCard from '../../components/reusables/property-card'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import PageTransition from '../../components/reusables/page-transition'
import { getProperties as getFirebaseProperties } from '../../services/properties.firebase'
import Loading from '../../components/reusables/loading'
import { PropertyState } from '../../types/property'
import { useDataCache } from '../../hooks/useDataCache'

const Properties = () => {
  const [location, setLocation] = useState('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [propertyType, setPropertyType] = useState<'all-properties' | 'for-rent' | 'for-sale'>('all-properties')
  const [slidesPerView, setSlidesPerView] = useState(3)
  const [properties, setProperties] = useState<PropertyState[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const areaMin =''
  const areaMax = ''
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const { getProperties: getCachedProperties, setProperties: setCachedProperties } = useDataCache()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1)
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2)
      } else {
        setSlidesPerView(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const cached = getCachedProperties();
    if (cached.isValid && cached.data.length > 0) {
      setProperties(cached.data);
      return;
    }

    setLoading(true);
    try {
      const firebaseData = await getFirebaseProperties();
      const formattedData = firebaseData.map(prop => ({
        ...prop,
        source: 'firebase' as const
      }));
      setProperties(formattedData);
      setCachedProperties(formattedData);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (propertiesList: PropertyState[]) => {
    return propertiesList
      .filter((property: PropertyState) => {
        const matchesPropertyType = propertyType === 'all-properties' || property.purpose === propertyType;
        const matchesLocation = !location || property.location.toLowerCase().includes(location.toLowerCase()) || property.title.toLowerCase().includes(location.toLowerCase());
        const matchesPrice = (!minPrice || property.price >= parseInt(minPrice)) &&
          (!maxPrice || property.price <= parseInt(maxPrice));
        const matchesArea = (!areaMin || property.area >= parseInt(areaMin)) &&
          (!areaMax || property.area <= parseInt(areaMax));

        return matchesPropertyType && matchesLocation && matchesPrice && matchesArea;
      })
      
  };

  const filteredProperties = applyFilters(properties);
  const forSaleProperties = filteredProperties.filter(prop => prop.purpose === 'for-sale');
  const forRentProperties = filteredProperties.filter(prop => prop.purpose === 'for-rent');

  // Calculate pagination for for-rent properties
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForRentProperties = forRentProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(forRentProperties.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-100 text-white pb-20">
        {error && (
          <div className="bg-red-500 text-white p-4 mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loading />
          </div>
        ) : (
          <div className="bg-dark-100">
            <div className="main xl:px-24 px-6 mb-96">
              {/* Hero Section */}
              <div className="hero relative mb-8 lg:mb-52">
                <div className="find-property bg-gradient-to-r from-dark-90 to-dark-100 py-16 md:py-24 -mx-6 md:-mx-24 px-6 md:px-24">
                  <div className="max-w-7xl">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
                      Find Your Dream Property
                    </h1>
                    <p className="text-dark-10 mb-12 text-base">
                      Welcome to ChoHomes, where your dream property awaits in every corner of our beautiful world. Explore our curated selection of properties, each offering a unique story and a chance to redefine your life. With categories to suit every dreamer, your journey 
                    </p>
                  </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="lg:absolute lg:-bottom-44 lg:left-1/2 lg:-translate-x-1/2 w-[calc(100%-3rem)] md:w-full max-w-7xl mx-auto -mt-6 ">
                  <div className="bg-dark-90 rounded-lg p-4 md:p-8 shadow-xl border border-dark-80">
                    {/* Main Search Bar */}
                    <div className="max-w-2xl mx-auto mb-6 md:mb-8">
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 px-4 py-4 bg-dark-100 rounded-md border border-dark-80">
                        <div className="relative flex-grow" ref={suggestionsRef}>
                          <input
                            type="text"
                            placeholder="Search location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-1 outline-none text-white bg-transparent placeholder:text-dark-10 w-full"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-btn-primary min-w-44 md:min-w-56 flex items-center justify-center gap-2 text-white px-6 py-2.5 rounded-md hover:bg-btn-secondary transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-btn-primary/20 hover:-translate-y-0.5 border border-transparent hover:border-btn-accent w-full sm:w-auto"
                        >
                          <FiSearch className="text-xl"/>
                          Find Properties
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Price Range */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                        <input
                          type="number"
                          placeholder="Min price"
                          className="w-full px-4 py-3 rounded-md bg-dark-100 border border-dark-80 outline-none focus:border-btn-primary text-white placeholder:text-dark-10"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Max price"
                          className="w-full px-4 py-3 rounded-md bg-dark-100 border border-dark-80 outline-none focus:border-btn-primary text-white placeholder:text-dark-10"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>

                      {/* Property Type */}
                      <select
                        className="w-full px-4 py-3 rounded-md bg-dark-100 border border-dark-80 outline-none focus:border-btn-primary text-white appearance-none"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as 'for-rent' | 'for-sale' | 'all-properties')}
                      >
                        <option value="all-properties">All Properties</option>
                        <option value="for-rent">For Rent</option>
                        <option value="for-sale">For Sale</option>
                      </select>

                      {/* Additional Filter Button */}
                      <button
                        type="button"
                        className="w-full px-4 py-3 rounded-md bg-dark-100 border border-dark-80 hover:border-btn-primary text-white transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                      >
                        <BiBuildingHouse className="text-dark-10 text-xl" />
                        More Filters
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Properties Slider - For Sale Properties */}
              {forSaleProperties.length ? <div className="mb-20">
                <div className="container mx-auto px-4 py-8">
                  <img src="/images/glitter.png" alt="Glitter"/>
                  <h2 className="text-4xl font-semibold mb-3 text-white mt-2">Properties For Sale</h2>
                  <p className="text-dark-10 mb-8">Browse through our collection of properties available for sale</p>
                  
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={24}
                      slidesPerView={slidesPerView}
                      navigation={{
                        prevEl: '.custom-prev',
                        nextEl: '.custom-next',
                      }}
                      pagination={{
                        type: 'fraction',
                        el: '.property-pagination',
                        formatFractionCurrent: (number) => String(number).padStart(2, '0'),
                        formatFractionTotal: (number) => String(number).padStart(2, '0'),
                      }}
                      breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                      }}
                    >
                      {forSaleProperties.map((property, index) => (
                        <SwiperSlide key={index}>
                          <Link to={`/single/${property.id}`}>
                            <PropertyCard
                              img={property.photos[0]}
                              name={property.title}
                              location={property.location}
                              description={property.description}
                              price={property.price}
                            />
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <div className="flex justify-between items-center mt-4">
                      <div className="property-pagination text-dark-10"></div>
                      <div className="flex gap-2">
                        <button className="custom-prev w-10 h-10 flex items-center justify-center rounded-full border border-dark-10 hover:bg-dark-80 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button className="custom-next w-10 h-10 flex items-center justify-center rounded-full border border-dark-10 hover:bg-dark-80 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div> : ''}

              {/* Properties Grid - For Rent Properties */}

              {currentForRentProperties.length ?  <div className="mb-20">
                <div className="container mx-auto px-4">
                <img src="/images/glitter.png" alt="Glitter"/>
                  <h2 className="text-4xl font-semibold mb-3 text-white mt-2">Properties For Rent</h2>
                  <p className="text-dark-10">Our portfolio of properties is as diverse as your dreams. Explore the following categories to find the perfect property that resonates with your vision of home</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {currentForRentProperties.map((property) => (
                      <Link key={property.id} to={`/single/${property.id}`}>
                        <PropertyCard
                          img={property.photos[0]}
                          name={property.title}
                          location={property.location}
                          description={property.description}
                          price={property.price}
                        />
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === number
                              ? 'bg-btn-primary text-white'
                              : 'bg-dark-90 text-white hover:bg-dark-80'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div> :''}
             
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default Properties