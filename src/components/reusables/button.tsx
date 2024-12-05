interface ButtonProps {
    text: string;
    variant?: 'black' | 'purple';
    className?: string;
    onClick?: () => void;
}

const Button = ({ text, variant = 'purple', className = '', onClick }: ButtonProps) => {
    const baseStyles = "p-3 px-4 rounded-md transition-all duration-300 ease-in-out"
    const variantStyles = {
        black: "bg-dark-100 text-white hover:bg-dark-80 shadow-md shadow-dark-50 hover:shadow-lg hover:shadow-dark-50/30 hover:-translate-y-0.5",
        purple: "bg-btn-primary text-white hover:bg-btn-secondary hover:shadow-lg hover:shadow-btn-primary/20 hover:-translate-y-0.5 border border-transparent hover:border-btn-accent"
    }

    return (
        <button 
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {text}
        </button>
    )
}

export default Button