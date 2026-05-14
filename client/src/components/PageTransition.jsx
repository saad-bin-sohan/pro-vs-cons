import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const PageTransition = ({ children, className = '' }) => {
    return (
        <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex flex-col ${className}`}
        >
            {children}
        </MotionDiv>
    );
};

export default PageTransition;
