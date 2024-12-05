import { Link, LinkProps } from 'react-router-dom';
import { fetchPropertyDetails } from '../../services/api';

interface PrefetchLinkProps extends LinkProps {
    propertyId?: string;
    onPrefetch?: () => Promise<void>;
}

const PrefetchLink = ({ propertyId, onPrefetch, children, ...props }: PrefetchLinkProps) => {
    const handleMouseEnter = async () => {
        try {
            if (propertyId) {
                await fetchPropertyDetails(propertyId);
            }
            if (onPrefetch) {
                await onPrefetch();
            }
        } catch (error) {
            console.error('Prefetch failed:', error);
        }
    };

    return (
        <Link 
            {...props} 
            onMouseEnter={handleMouseEnter}
        >
            {children}
        </Link>
    );
};

export default PrefetchLink;
