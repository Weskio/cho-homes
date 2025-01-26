import Button from "../../components/reusables/button";
import FeatureCard from "../../components/reusables/feature-card";
import { FEATURECARDS, INFOCARDS, PROPERTIES } from "../../constants/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef } from "react";
import { Link } from "react-router-dom";

const infoCards = INFOCARDS;
const featureCards = FEATURECARDS;

const home = () => {
  const propertyPrevRef = useRef<HTMLButtonElement>(null);
  const propertyNextRef = useRef<HTMLButtonElement>(null);
  const testimonialPrevRef = useRef<HTMLButtonElement>(null);
  const testimonialNextRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div className="main mb-[5vh] min-h-screen">
        <div className="hero flex flex-col lg:flex-row  lg:h-[60%] relative">
          <div className="desc-text order-2 lg:order-1 mt-8 lg:mt-auto mb-auto xl:px-24 px-6 w-full lg:w-[50%]">
            <p className="text-2xl font-semibold md:text-4xl lg:text-5xl leading-[3rem] md:leading-[4rem]">
              Discover Your Dream Property with ChoHomes
            </p>
            <p className="text-dark-10 text-sm md:text-base mt-4">
              Your journey to finding the perfect property begins here. Explore
              our listings to find the home that matches your dreams.
            </p>

            <div className="btns mt-8 lg:mt-20 flex gap-4 lg:gap-6">
              <Button text="Learn More" variant="black" />

              <Link to="/properties">
                <Button text="Browse Properties" variant="purple" />
              </Link>
            </div>

            <div className="info-cards mt-8 lg:mt-16 grid grid-cols-2 md:flex gap-4">
              {infoCards.map((card, index) => (
                <div
                  key={index}
                  className="card p-4 md:p-8 rounded-lg bg-dark-90"
                >
                  <p className="count font-semibold text-xl md:text-3xl">
                    {card.count}
                  </p>
                  <p className="text-dark-10 text-xs md:text-sm lg:text-base mt-2">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-img order-1 lg:order-2 lg:ml-auto -mt-6 w-full lg:w-auto relative">
            {/* Mobile Image */}
            <div className="mob p-3">
              <img
                src="./images/hero-img-mobile.png"
                alt="Hero"
                className=" w-[100%] mr-8 rounded-lg h-[300px] object-cover lg:hidden"
              />
            </div>

            {/* Tablet Image */}
            <img
              src="./images/hero-img.png"
              alt="Hero"
              className="hidden lg:block xl:hidden w-full h-auto"
            />
            {/* Desktop Image */}
            <img
              src="./images/hero-img-desktop.png"
              alt="Hero"
              className="hidden xl:block"
            />
            <Link to="/properties">
              <button className="absolute left-0 top-1/2 lg:top-1/4 lg:-translate-x-1/2 lg:-translate-y-1/2 bg-dark-100 rounded-full border border-dark-90 flex items-center justify-center group hover:bg-dark-80 transition-all duration-300">
                <div className="relative w-[180px] h-[180px]">
                  <div className="absolute inset-0 animate-spin-slow">
                    <span
                      className="absolute inset-0 text-white uppercase tracking-wider"
                      style={{
                        animation: "rotate 20s linear infinite",
                      }}
                    >
                      {[..."✨ Discover • Your • Dream • Property • "].map(
                        (char, i) => (
                          <span
                            key={i}
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              transform: `rotate(${
                                i * 9.2
                              }deg) translateY(-80px)`,
                              transformOrigin: "0 0",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {char}
                          </span>
                        )
                      )}
                    </span>
                  </div>

                  {/* Center arrow button */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-dark-90 flex items-center justify-center group-hover:bg-dark-80 transition-colors">
                    <img
                      src="./images/arrow-icon.png"
                      alt="Arrow"
                      className="w-6 h-6"
                    />
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </div>
        {/* Feature Cards Section */}
        <div className="feature-cards-wrapper lg:mt-0 mt-8 w-full border-t-4 border-b-4 border-dark-80">
          <div className="feature-cards px-4 py-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card, index) => (
                <FeatureCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <section className="w-full py-20 bg-dark-100 xl:px-24 px-6 ">
          <div className="w-full">
            <div className="md:flex justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 bg-btn-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-btn-primary rounded-full"></div>
                </div>
                <h2 className="text-4xl font-bold">Featured Properties</h2>
                <p className="text-dark-10 mt-2">
                  Explore our handpicked selection of featured properties. Each
                  listing offers a unique mix of residential homes and
                  investments available through Estates. Click "View Details"
                  for more information.
                </p>
              </div>
              <Link to="/properties">
                <Button text="View All Properties" variant="black" />
              </Link>
            </div>
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                navigation={{
                  prevEl: propertyPrevRef.current,
                  nextEl: propertyNextRef.current,
                }}
                pagination={{
                  type: "fraction",
                  el: ".property-pagination",
                  formatFractionCurrent: (number) =>
                    String(number).padStart(2, "0"),
                  formatFractionTotal: (number) =>
                    String(number).padStart(2, "0"),
                }}
                onBeforeInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = propertyPrevRef.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = propertyNextRef.current;
                }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {PROPERTIES.map((property, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-dark-90 rounded-xl overflow-hidden">
                      <div className="relative h-[220px]">
                        <img
                          src={property.img}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {property.name}
                        </h3>
                        <p className="text-dark-10 text-sm mb-4">
                          {property.location}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-dark-10">2 Bedrooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-dark-10">2 Bathrooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-dark-10">Yes</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-dark-10 text-sm">Price</p>
                            <p className="text-xl font-bold">
                              ${property.price.toLocaleString()}
                            </p>
                          </div>
                          <Button
                            text="View Property Details"
                            variant="purple"
                            className="!py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex justify-between items-center mt-4">
                <div className="property-pagination text-dark-10"></div>
                <div className="flex gap-2">
                  <button
                    ref={propertyPrevRef}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-dark-10 hover:bg-dark-80 transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    ref={propertyNextRef}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-dark-10 hover:bg-dark-80 transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20 xl:px-24 px-6 ">
          <div className="">
            <div className="md:flex justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 bg-btn-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-btn-primary rounded-full"></div>
                </div>
                <h2 className="text-4xl font-bold">What Our Clients Say</h2>
                <p className="text-dark-10 mt-2">
                  Here's the success stories and heartfelt testimonials from our
                  valued clients. Discover why they chose Estates for their real
                  estate needs.
                </p>
              </div>
              <Button text="View All Testimonials" variant="black" />
            </div>
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                navigation={{
                  prevEl: testimonialPrevRef.current,
                  nextEl: testimonialNextRef.current,
                }}
                pagination={{
                  type: "fraction",
                  el: ".testimonial-pagination",
                  formatFractionCurrent: (number) =>
                    String(number).padStart(2, "0"),
                  formatFractionTotal: (number) =>
                    String(number).padStart(2, "0"),
                }}
                onBeforeInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = testimonialPrevRef.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = testimonialNextRef.current;
                }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {[
                  {
                    rating: 5,
                    title: "Exceptional Service!",
                    text: "Our experience with Estates was outstanding. Their team's dedication and professionalism made finding our dream home a breeze. Highly recommended!",
                    author: "Wade Warren",
                    role: "Villa Owner",
                  },
                  {
                    rating: 5,
                    title: "Efficient and Reliable",
                    text: "Estates provided us with top-notch service. They helped us sell our property quickly and at a great price. We couldn't be happier with the results!",
                    author: "Esther Howard",
                    role: "Home Seller",
                  },
                  {
                    rating: 5,
                    title: "Trusted Advisors",
                    text: "The Estates team guided us through the entire buying process. Their knowledge and commitment to our needs were impressive. Thank you for your support!",
                    author: "John Mario",
                    role: "First Buyer",
                  },
                ].map((testimonial, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-dark-90 rounded-xl p-8">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {testimonial.title}
                      </h3>
                      <p className="text-dark-10 mb-6">{testimonial.text}</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-dark-80 rounded-full"></div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-dark-10 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex justify-between items-center mt-4">
                <div className="testimonial-pagination text-dark-10"></div>
                <div className="flex gap-2">
                  <button
                    ref={testimonialPrevRef}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-dark-10 hover:bg-dark-80 transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    ref={testimonialNextRef}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-dark-10 hover:bg-dark-80 transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full xl:px-24 px-6  py-20 bg-dark-100">
          <div className="">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 bg-btn-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-btn-primary rounded-full"></div>
                </div>
                <h2 className="text-4xl font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="text-dark-10 mt-2">
                  Find answers to common questions about Estates's services,
                  property listings, and the real estate process. We're here to
                  provide clarity and assist you every step of the way.
                </p>
              </div>
              <Button text="View All FAQs" variant="black" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  question: "How do I search for properties on Estates?",
                  description:
                    "Learn how to use our user-friendly search tools to find properties that match your criteria",
                },
                {
                  question:
                    "What documents do I need to sell my property through Estates?",
                  description:
                    "Find out about the necessary documentation for listing your property with us.",
                },
                {
                  question: "How can I contact an Estates agent?",
                  description:
                    "Discover the different ways you can get in touch with our experienced agents.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-dark-90 rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4">{faq.question}</h3>
                  <p className="text-dark-10 mb-6">{faq.description}</p>
                  <Button text="Read More" variant="black" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default home;
