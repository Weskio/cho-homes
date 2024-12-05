import { useState, useEffect, memo } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    onClick?: () => void;
    priority?: boolean;
}

const OptimizedImage = memo(({ src, alt, className = '', onClick, priority = false }: OptimizedImageProps) => {
    const [isLoading, setIsLoading] = useState(!priority);
    const [currentSrc, setCurrentSrc] = useState(priority ? src : '');

    useEffect(() => {
        if (!priority) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setCurrentSrc(src);
                setIsLoading(false);
            };
        }
    }, [src, priority]);

    if (isLoading) {
        return (
            <div 
                className={`${className} bg-dark-80 animate-pulse flex items-center justify-center`}
                role="presentation"
            >
                <div className="w-12 h-12 border-4 border-dark-50 rounded-full border-t-btn-primary animate-spin"></div>
            </div>
        );
    }

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            onClick={onClick}
            loading={priority ? 'eager' : 'lazy'}
        />
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
