import React, { useState, useEffect, useRef } from 'react'
import { Link} from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { BiBuildingHouse } from 'react-icons/bi'
import PropertyCard from '../../components/reusables/property-card'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import 'swiper/css'
import PageTransition from '../../components/reusables/page-transition'
import { fetchProperties, SearchParams, fetchLocationSuggestions, LocationSuggestion } from '../../services/api'
import { getProperties as getFirebaseProperties } from '../../services/properties.firebase'
import Loading from '../../components/reusables/loading'
import { PropertyState, PropertySource, mapFirebaseToAPIProperty } from '../../types/property'

const Properties = () => {
  const [location, setLocation] = useState('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [propertyType, setPropertyType] = useState<'for-rent' | 'for-sale'>('for-rent')
  const [currentSlide, setCurrentSlide] = useState(1)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [slidesPerView, setSlidesPerView] = useState(3)
  const [properties, setProperties] = useState<PropertyState[] | any>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dataSource, setDataSource] = useState<PropertySource>('api')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)


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
    const loadInitialProperties = async () => {
      setLoading(true);
      try {
        if (dataSource === 'api') {
          const params: SearchParams = {
            locationExternalIDs: '5002,5003', // Dubai location IDs
            purpose: propertyType,
            hitsPerPage: '25',
            priceMin: minPrice,
            priceMax: maxPrice,
          };
          const data = await fetchProperties(params);
          setProperties(data);
        }
        else {
          try{
             const firebaseData = await getFirebaseProperties({
            purpose: propertyType,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            location: location || undefined
          });

          setProperties(firebaseData.map(mapFirebaseToAPIProperty));
          // If no Firebase data or search is empty, fetch Dubai properties as placeholder
          if (firebaseData.length === 0 && !location && !minPrice && !maxPrice) {
            const dubaiParams: SearchParams = {
              locationExternalIDs: '5002,5003', // Dubai location IDs
              purpose: propertyType,
              hitsPerPage: '25'
            };
            const dubaiData = await fetchProperties(dubaiParams);
            setProperties(dubaiData);
          }
          }
          catch(error){
            setError('Failed to load properties');
          }
          
        }
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    loadInitialProperties();
  }, [dataSource, location, propertyType, minPrice, maxPrice]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const suggestions = await fetchLocationSuggestions(location)
        setSuggestions(suggestions)
        setShowSuggestions(true)
      } catch (err) {
        console.error('Failed to fetch location suggestions:', err)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    setShowSuggestions(false)
    try {
      const params: SearchParams = {
        locationExternalIDs: suggestions[0]?.externalID || '',
        purpose: propertyType,
        hitsPerPage: '25',
      }
      const data = await fetchProperties(params)
      setProperties(data)
    } catch (err) {
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.name)
    setShowSuggestions(false)
    const params: SearchParams = {
      locationExternalIDs: suggestion.externalID,
      purpose: propertyType,
      hitsPerPage: '25',
    }
    fetchProperties(params)
      .then(setProperties)
      .catch(() => setError('Failed to load properties'))
  }

  const loadProperties = async (searchParams: SearchParams) => {
    try {
      setLoading(true)
      if (dataSource === 'api') {
        const data = await fetchProperties(searchParams)
        setProperties(data)
      } else {
        const data = await getFirebaseProperties()
        setProperties(data.map(mapFirebaseToAPIProperty))
      }
      setError('')
    } catch (err) {
      setError('Failed to load properties. Please try again later.')
      console.error('Error loading properties:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchForm = async (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams: SearchParams = {
      purpose: propertyType,
      locationExternalIDs: suggestions.length > 0 ? suggestions[0].externalID : '5002,6020',
      hitsPerPage: '25'
    }
    
    if (minPrice) searchParams.priceMin = minPrice
    if (maxPrice) searchParams.priceMax = maxPrice
    
    await loadProperties(searchParams)
  }

  const totalSlides = Math.ceil(properties.length / slidesPerView)

  if (loading) return <Loading/>

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => loadProperties({ purpose: 'for-rent', locationExternalIDs: '5002,6020', sort: 'price-desc' })} 
            className="bg-btn-primary px-6 py-2 rounded-md hover:bg-btn-secondary transition-all"
          >
            Try Again
          </button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="bg-dark-100">
        <div className="main xl:px-24 px-6 mb-96">
          {/* Hero Section */}
          <div className="hero relative">
            <div className="find-property bg-gradient-to-r from-dark-90 to-dark-100 py-16 md:py-24 -mx-6 md:-mx-24 px-6 md:px-24">
              <div className="max-w-7xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
                  Find Your Dream Property
                </h1>
                <p className="text-dark-10 mb-12 text-base md:text-lg max-w-2xl">
                  Welcome to ChoHomes, where your dream property awaits in every corner of our beautiful world. Explore our curated selection of properties, each offering a unique story and a chance to redefine your life. With categories to suit every dreamer, your journey 
                </p>
              </div>
            </div>

            <form onSubmit={handleSearchForm} className="lg:absolute lg:-bottom-44 lg:left-1/2 lg:-translate-x-1/2 w-[calc(100%-3rem)] md:w-full max-w-7xl mx-auto -mt-6">
              <div className="bg-dark-90 rounded-lg p-4 md:p-8 shadow-xl border border-dark-80">
                {/* Data Source Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="bg-dark-100 p-1 rounded-lg inline-flex">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded ${
                        dataSource === 'api'
                          ? 'bg-btn-primary text-white'
                          : 'text-dark-10 hover:text-white'
                      }`}
                      onClick={() => setDataSource('api')}
                    >
                      API Data
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded ${
                        dataSource === 'local'
                          ? 'bg-btn-primary text-white'
                          : 'text-dark-10 hover:text-white'
                      }`}
                      onClick={() => setDataSource('local')}
                    >
                      Local Listings
                    </button>
                  </div>
                </div>

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
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-dark-90 border border-dark-80 rounded shadow-lg max-h-60 overflow-y-auto">
                          {suggestions.map((suggestion) => (
                            <div
                              key={suggestion.externalID}
                              className="px-4 py-2 hover:bg-dark-80 cursor-pointer"
                              onClick={() => handleLocationSelect(suggestion)}
                            >
                              {suggestion.name}
                            </div>
                          ))}
                        </div>
                      )}
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
                    onChange={(e) => setPropertyType(e.target.value as 'for-rent' | 'for-sale')}
                  >
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

          {/* Properties Slider */}
          <div className="mt-8 lg:mt-52 mb-20">
            <div className="container mx-auto px-4 py-8">
              <div className="relative">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={32}
                  slidesPerView={slidesPerView}
                  onSlideChange={(swiper) => {
                    setCurrentSlide(swiper.activeIndex + 1)
                    setIsBeginning(swiper.isBeginning)
                    setIsEnd(swiper.isEnd)
                  }}
                  className="relative"
                  navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 20
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 32
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 32
                    }
                  }}
                >
                  {properties.map((property:any) => (
                    <SwiperSlide key={property.id}>
                      <Link to={`/single/${property.externalID || property.id}`}>
                        <PropertyCard
                          img={property.coverPhoto.url}
                          name={property.title}
                          location={property.location[property.location.length - 1].name}
                          description={property.description}
                          price={property.price}
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Navigation */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 justify-between mt-8">
                  <div className="text-white font-medium order-2 sm:order-1">
                    {currentSlide}<span className='text-dark-10'> of {totalSlides}</span>
                  </div>
                  <div className="flex gap-4 order-1 sm:order-2">
                    <button 
                      className={`swiper-button-prev w-12 h-12 rounded-full bg-dark-90 border border-dark-80 hover:border-btn-primary flex items-center justify-center text-white transition-all duration-300 ${isBeginning ? 'opacity-50 cursor-not-allowed hover:border-dark-80' : ''}`}
                      disabled={isBeginning}
                    >
                      <MdArrowBack className="text-2xl" />
                    </button>
                    <button 
                      className={`swiper-button-next w-12 h-12 rounded-full bg-dark-90 border border-dark-80 hover:border-btn-primary flex items-center justify-center text-white transition-all duration-300 ${isEnd ? 'opacity-50 cursor-not-allowed hover:border-dark-80' : ''}`}
                      disabled={isEnd}
                    >
                      <MdArrowForward className="text-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Properties