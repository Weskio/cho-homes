import { useNavigate } from 'react-router-dom'
import PageTransition from '../../components/reusables/page-transition'
import Button from '../../components/reusables/button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div 
        className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/404.png")' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-100/90 to-dark-100/70" />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-semibold mb-4 bg-gradient-to-r from-white to-dark-10 bg-clip-text text-transparent">
              404
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Oops! Page Not Found
            </h2>
            
            <p className="text-dark-10 text-lg mb-8 max-w-xl mx-auto">
              The page you're looking for seems to have wandered off. Don't worry, even the best properties can be hard to find sometimes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                text="Go Back" 
                variant="black"
                onClick={() => navigate(-1)}
              />
              <Button 
                text="Back to Home" 
                onClick={() => navigate('/')}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default NotFound