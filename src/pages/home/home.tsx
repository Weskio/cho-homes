import Button from "../../components/reusables/button"
import FeatureCard from "../../components/reusables/feature-card"
import { FEATURECARDS, INFOCARDS } from "../../constants/data"

const infoCards = INFOCARDS
const featureCards = FEATURECARDS

const home = () => {
  return (
    <div>
        <div className="main mb-[100vh] min-h-screen">
        <div className="hero flex flex-col lg:flex-row  lg:h-[60%] relative">
            <div className="desc-text order-2 lg:order-1 mt-8 lg:mt-auto mb-auto xl:px-24 px-6 w-full lg:w-[50%]">
                <p className="text-2xl font-semibold md:text-4xl lg:text-5xl leading-[3rem] md:leading-[4rem]">Discover Your Dream Property with ChoHomes</p>
                <p className='text-dark-10 text-sm md:text-base mt-4'>Your journey to finding the perfect property begins here. Explore our listings to find the home that matches your dreams.</p>

                <div className="btns mt-8 lg:mt-20 flex gap-4 lg:gap-6">
                    <Button text="Learn More" variant="black"/>
                    <Button text="Browse Properties" variant="purple"/>
                </div>

                <div className="info-cards mt-8 lg:mt-16 grid grid-cols-2 md:flex gap-4">
                    {infoCards.map((card, index) => (
                        <div key={index} className="card p-4 md:p-8 rounded-lg bg-dark-90">
                            <p className="count font-semibold text-xl md:text-3xl">{card.count}</p>
                            <p className='text-dark-10 text-xs md:text-sm lg:text-base mt-2'>{card.text}</p>
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
                <button className="absolute left-0 top-1/2 lg:top-1/4 lg:-translate-x-1/2 lg:-translate-y-1/2 bg-dark-100 rounded-full border border-dark-90 flex items-center justify-center group hover:bg-dark-80 transition-all duration-300">
                    <div className="relative w-[180px] h-[180px]">

                        <div className="absolute inset-0 animate-spin-slow">
                            <span className="absolute inset-0 text-white uppercase tracking-wider" style={{
                                animation: 'rotate 20s linear infinite',
                            }}>
                                {[..."✨ Discover • Your • Dream • Property • "].map((char, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            top: '50%',
                                            transform: `rotate(${i * 9.2}deg) translateY(-80px)`,
                                            transformOrigin: '0 0',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                        </div>
                        {/* Center arrow button */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-dark-90 flex items-center justify-center group-hover:bg-dark-80 transition-colors">
                            <img src="./images/arrow-icon.png" alt="Arrow" className="w-6 h-6" />
                        </div>
                    </div>
                </button>
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
    </div>
    </div>
  )
}

export default home