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
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-dark-90 rounded-lg overflow-hidden border border-dark-80 hover:border-btn-primary transition-all duration-300 group h-[420px] flex flex-col">
            {/* Image Container */}
            <div className="relative h-[240px] overflow-hidden">
                <img 
                    src={img || '/placeholder-property.jpg'} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-btn-primary text-white px-4 py-2 rounded-md">
                    {formatPrice(price)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {name}
                </h3>
                <div className="flex items-center gap-2 text-dark-10 mb-4">
                    <FiMapPin className="text-btn-primary" />
                    <span className="line-clamp-1">{location}</span>
                </div>
                <p className="text-dark-10 line-clamp-2 flex-1">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default PropertyCard
