import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MENUITEMS } from "../../constants/data";
import { Link } from "../../constants/interfaces";
import Logo from "./logo";
import Button from "../reusables/button";

const header = () => {
    const [showNotification, setShowNotification] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const menuItems: Link[] = MENUITEMS

  return (
    <div className=''>
        {showNotification ? (
            <div className="notification flex bg-[url('/images/header-notification-bg.png')] bg-cover md:w-full text-center p-4 px-2 py-4 md:p-4">
           <p className="text-[0.74rem] mt-2 lg:mt-0 w-[88%] md:w-full md:text-[1rem]">🎇Discover Your Dream Property with ChoHomes. <span><a className="underline hover:text-dark-10" href="">Learn More</a></span></p> 
           <button onClick={() => setShowNotification(false)} className='ml-auto'><img src="/images/close-btn.png" alt="" /></button>
        </div>) : ''
        }
        
        <div className="main flex bg-gradient-to-r from-dark-90 to-dark-80 md:px-6 px-3 p-6 xl:px-24 border-t border-b border-dark-80">
           <Logo/>
            <div className="menu hidden lg:block ml-auto mr-auto">
                <ul className="menu-items lg:flex gap-6 relative">
                    {menuItems.filter(item => item.name !== 'Contact').map((item, index) => (
                        <li key={index} className="menu-item transition-all duration-300 p-2 px-4 cursor-pointer rounded-md relative">
                            <NavLink 
                                to={`/${item.link}`}
                                className={({ isActive }) => `
                                    relative z-10 transition-colors duration-300
                                    ${isActive ? 'text-dark-50' : 'hover:text-dark-50'}
                                    after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 
                                    after:h-[2px] after:bg-dark-50 after:transition-all after:duration-300
                                    after:transform after:origin-left
                                    ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}
                                `}
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mob-menu-btn  ml-auto lg:hidden">
                <button onClick={() => setShowMenu(true)}>
                    <img src="./images/mobile-menu-icon.png" alt="" />
                </button>
            </div>
            <div className="contact hidden lg:block">
                <NavLink to={'/contact'}>
                <Button text="Contact Us" variant="black"/>
                </NavLink>
             </div>
        </div>

        <div className={`mob-menu fixed z-10 inset-0 bg-dark-90 bg-opacity-80 transition-all duration-300 ease-out ${showMenu ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            <div className={`absolute rounded-tl-[2rem] rounded-bl-[2rem] top-0 right-0 h-full w-[60%] bg-dark-100 transform transition-transform duration-300 ease-out ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                <button onClick={() => setShowMenu(false)} className='absolute top-4 right-4'><img src="./images/close-btn.png" alt="" /></button>
                <ul className="flex flex-col gap-4 pl-8 pt-12 pb-4 rounded-lg">
                {
                    menuItems.map((item, index) => (
                        <li key={index} className="cursor-pointer transform transition-all duration-200">
                            <NavLink 
                                to={`/${item.link}`}
                                onClick={() => setShowMenu(false)}
                                className={({ isActive }) => 
                                    isActive ? 
                                    "text-dark-50 translate-y-[-2px] translate-x-[2px]" : 
                                    "hover:text-dark-50 hover:translate-y-[-2px] hover:translate-x-[2px]"
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))
                }
                    <div className="logo absolute flex gap-2 bottom-8 cursor-pointer">
                        <img src="./images/logo.png" alt="" className="w-8 h-8"/>
                        <p className="text-xl font-semibold mt-1">ChoHomes</p>
                    </div>                    
                </ul>
            </div>
        </div>

    </div>
  )
}

export default header