const AppLogo = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill="#C05621" />
      <rect x="8" y="7" width="4" height="14" rx="1" fill="white" />
      <rect x="8" y="7" width="9" height="4" rx="1" fill="white" />
      <rect x="8" y="13" width="8" height="3.5" rx="1" fill="white" />
      <rect x="15" y="14" width="4" height="7" rx="1" fill="white" />
    </svg>
  );
};

export default AppLogo;
