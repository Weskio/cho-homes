interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    return (
        <div className="feature-card group">
            <div className="card-content bg-dark-90 shadow-sm shadow-dark-10 rounded-xl p-8 hover:bg-dark-50 transition-all duration-300 relative">
                <div className="absolute right-8 top-8 w-10 h-10 rounded-full bg-dark-90 flex items-center justify-center group-hover:bg-dark-80 transition-all duration-300">
                    <img src="./images/arrow-icon.png" alt="Arrow" className="w-4 h-4" />
                </div>
                <div className="icon-wrapper w-14 h-14 rounded-full flex items-center justify-center mb-6">
                    <img src={icon} alt={title} className="w-14 h-14" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-dark-10 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

export default FeatureCard
