import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const PageTransition = ({ children, className = '' }) => {
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </MotionDiv>
    );
};

export default PageTransition;
