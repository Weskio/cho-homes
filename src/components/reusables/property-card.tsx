import { FiMapPin } from 'react-icons/fi'

interface PropertyCardProps {
    img: string;
    name: string;
    location: string;
    description: string;
    price: number;
}

const PropertyCard = ({ img, name, location, description, price }: PropertyCardProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-dark-90 rounded-lg overflow-hidden border border-dark-80 hover:border-btn-primary transition-all duration-300 group">
            {/* Image Container */}
            <div className="relative h-[240px] overflow-hidden">


                <img 
                    src={img} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-btn-primary text-white px-4 py-2 rounded-md">
                    {formatPrice(price)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                    {name}
                </h3>
                <div className="flex items-center gap-2 text-dark-10 mb-4">
                    <FiMapPin className="text-btn-primary" />
                    <span>{location}</span>
                </div>
                <p className="text-dark-10 line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default PropertyCard
