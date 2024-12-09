import { useParams, useNavigate } from 'react-router-dom'
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import { BiBed, BiBath, BiArea } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { IoArrowBack } from 'react-icons/io5'
import PageTransition from '../../components/reusables/page-transition'
import NotFound from '../notFound/not-found'
import { Property, fetchPropertyDetails } from '../../services/api'
import { getPropertyById } from '../../services/properties.firebase'
import { mapFirebaseToAPIProperty } from '../../types/property'
import Loading from '../../components/reusables/loading'
import ContactForm from '../../components/forms/contact-form'

const SingleProperty = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const firebaseProperty = await getPropertyById(id)
        if (firebaseProperty) {
          setProperty(mapFirebaseToAPIProperty(firebaseProperty))
        } else {
          const apiProperty = await fetchPropertyDetails(id)
          setProperty(apiProperty)
        }
        setError(null)
      } catch (err) {
        setError('Failed to load property details. Please try again later.')
        console.error('Error loading property:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [id])

  if (loading) return <Loading />
  if (error || !property) return <NotFound />

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % property.photos.length)
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length)
  }

  const getNextIndex = (current: number) => (current + 1) % property.photos.length

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <IoArrowBack size={20} />
          <span>Back to Properties</span>
        </button>

        <div className="mb-6">
          {/* Property Header */}
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-dark-10">
                  <FiMapPin className="text-btn-primary" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-btn-primary">
                USD {property.price.toLocaleString()}
                {property.rentFrequency && `/${property.rentFrequency}`}
              </div>
            </div>
          </div>
        </div>

        {/* Image Slider */}
        <div className="bg-dark-90 rounded-lg border border-dark-80 p-4 lg:p-8 mb-8">
          {/* Thumbnails */}
          <div className="relative">
            <div 
              className="flex justify-start lg:justify-center gap-2 lg:gap-4 mb-6 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide"
              ref={(ref) => {
                if (ref) {
                  const activeThumb = ref.children[activeIndex] as HTMLElement;
                  if (activeThumb) {
                    const scrollLeft = activeThumb.offsetLeft - (ref.clientWidth - activeThumb.clientWidth) / 2;
                    ref.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                  }
                }
              }}
            >
              {property.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className={`relative cursor-pointer transition-all flex-shrink-0 ${
                    idx === activeIndex ? "opacity-100 scale-110" : "opacity-40"
                  }`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-16 h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Images */}
          <div className="relative flex justify-center items-center mb-6">
            {/* Active Images */}
            <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
              <img
                src={property.photos[activeIndex]}
                alt={`Active ${activeIndex + 1}`}
                className="w-full md:w-[600px] lg:w-[500px] h-[300px] md:h-[450px] lg:h-[400px] object-cover rounded mx-auto"
              />
              <img
                src={property.photos[getNextIndex(activeIndex)]}
                alt={`Active ${activeIndex + 2}`}
                className="hidden lg:block w-full lg:w-[500px] h-[300px] lg:h-[400px] object-cover rounded"
              />
            </div>
          </div>

          {/* Navigation Controls Container */}
          <div className="relative max-w-[1000px] mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-0 lg:left-4 top-[-200px] md:top-[-250px] lg:top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-all"
            >
              <MdKeyboardArrowLeft size={24} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-0 lg:right-4 top-[-200px] md:top-[-250px] lg:top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-all"
            >
              <MdKeyboardArrowRight size={24} />
            </button>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-1 flex-wrap max-w-[80%] mx-auto">
              {property.photos.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1 rounded-full transition-all cursor-pointer mb-1 ${
                    idx === activeIndex
                      ? "w-6 bg-btn-primary"
                      : "w-2 bg-dark-80 hover:bg-dark-70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid md:grid-cols-[2fr,1fr] gap-8 mb-12">
          {/* Left Column */}
          <div>
            <div className="bg-dark-90 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-dark-10">{property.description}</p>
            </div>

            <div className="bg-dark-90 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-dark-10">
                  <BiBed className="text-btn-primary text-xl" />
                  <span>{property.rooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2 text-dark-10">
                  <BiBath className="text-btn-primary text-xl" />
                  <span>{property.baths} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2 text-dark-10">
                  <BiArea className="text-btn-primary text-xl" />
                  <span>{property.area.toFixed(2)} sqft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form and Agent Info */}
          <div className="space-y-6">
            {/* Agent Information */}
            <div className="bg-dark-90 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Agent</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{property.contactInfo?.name}</h3>
                  <div className="flex flex-col gap-2 mt-2">
                    <a 
                      href={`mailto:${property.contactInfo?.email}`}
                      className="flex items-center gap-2 text-dark-10 hover:text-white transition-colors"
                    >
                      <FiMail className="text-btn-primary" />
                      {property.contactInfo?.email}
                    </a>
                    {property.contactInfo?.phone && (
                      <a 
                        href={`tel:${property.contactInfo.phone}`}
                        className="flex items-center gap-2 text-dark-10 hover:text-white transition-colors"
                      >
                        <FiPhone className="text-btn-primary" />
                        {property.contactInfo.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-dark-90 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Send Message</h2>
              <ContactForm 
                propertyId={property.id || ''} 
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default SingleProperty