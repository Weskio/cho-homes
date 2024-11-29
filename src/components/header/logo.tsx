import { NavLink } from 'react-router-dom'

const logo = () => {
  return (
    <NavLink to={'/'}>
    <div className="logo flex gap-2 cursor-pointer">
                <img src="/images/logo.png" alt="" className="w-8 h-8"/>
                <p className="text-xl font-semibold mt-1">ChoHomes</p>
            </div>
    </NavLink>
    
  )
}

export default logo