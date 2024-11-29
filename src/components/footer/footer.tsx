import { NavLink } from "react-router-dom"
import { FOOTERLINKS, SOCIALMEDIA } from "../../constants/data"
import Logo from "../header/logo"
import Newsletter from "./newsletter"
import Button from "../reusables/button"

const footer = () => {
  const footerLinks = FOOTERLINKS

  return (
    <div className=' w-full bg-gradient-to-r border-t border-dark-80 from-dark-100 to-dark-90'>
      <div className="explore-projects py-10 lg:py-20 flex flex-col md:flex-row px-6 xl:px-24">
        <div className="desc-text w-full md:w-[70%]">
          <p className="text-2xl md:text-3xl leading-[3rem] md:leading-[4rem] font-semibold">Start Your Real Estate Journey Today</p>
          <p className='text-dark-10 text-sm md:text-base mt-4'>Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.</p>
        </div>
        <div className="explore-btn mt-8 w-full md:w-auto md:mt-8 md:ml-auto">
          <Button text="Explore Properties"/>
        </div>
      </div>

      <div className="footer-main border-t py-12 px-6 xl:px-24 flex flex-col lg:flex-row gap-12 md:gap-6 border-dark-50">
        <div className="newsletter relative flex md:flex-row flex-col gap-4 lg:flex-col">
          <div className="logo w-full"><Logo/></div>
          <div className="newsletter w-full"><Newsletter/></div>
          <div className="block lg:hidden w-full h-[1px] bg-gradient-to-r from-transparent via-dark-50 to-transparent absolute -bottom-6"></div>
        </div>

        <div className="footer-links grid grid-cols-2 gap-y-12 lg:flex lg:gap-16 lg:ml-auto">
          {footerLinks.map((item,index) => (
            <div key={index} className="section relative">
              {/* Mobile-only separators */}
              {index % 2 === 1 && (
                <div className="block lg:hidden absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-dark-50 to-transparent"></div>
              )}
              <div className="block lg:hidden w-full h-[1px] bg-gradient-to-r from-transparent via-dark-50 to-transparent absolute -bottom-6"></div>
              
              <p className={`mb-4 text-dark-10 ${index % 2 === 1 ? 'pl-4 md:pl-6' : ''}`}>{item.title}</p>
              <div className={`flex flex-col gap-2 ${index % 2 === 1 ? 'pl-4 md:pl-6' : ''}`}>
                {item.links.map((item,index) => (
                  <p key={index} className="mb-2 hover:text-dark-10 capitalize"> 
                    <NavLink to={`/${item.link}`}>{item.name}</NavLink>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="copyright border-t border-dark-80 bg-dark-90 py-4 px-6 xl:px-24 flex flex-col md:flex-row items-center gap-4 md:gap-0">
        <div className="social-icons flex gap-4">
          {SOCIALMEDIA.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-dark-100 transition-colors hover:bg-btn-primary group"
            >
              <img 
                src={item.icon} 
                alt={item.name} 
                className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </a>
          ))}
        </div>
        <p className="md:ml-auto text-dark-10"> 2024 ChoHomes. All rights reserved.</p>
      </div>
    </div>
  )
}

export default footer