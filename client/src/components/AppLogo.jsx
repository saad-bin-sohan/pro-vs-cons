import logoSrc from '../assets/logo.png';

const AppLogo = ({ size = 28, className = '' }) => {
    return (
        <img
            src={logoSrc}
            alt="ProVsCons logo"
            width={size}
            height={size}
            className={`inline-block flex-shrink-0 ${className}`}
        />
    );
};

export default AppLogo;
