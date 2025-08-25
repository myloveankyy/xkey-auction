import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveBroadcast } from '../features/broadcasts/broadcastSlice';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ArrowRight } from 'lucide-react';

const BroadcastBanner = () => {
    const dispatch = useDispatch();
    const { activeBroadcast } = useSelector((state) => state.broadcasts);
    const [isVisible, setIsVisible] = useState(false);

    // Fetch the active broadcast on initial application load
    useEffect(() => {
        dispatch(getActiveBroadcast());
    }, [dispatch]);

    // This effect controls whether the banner should be shown.
    // It checks if an active broadcast exists and if the user has already dismissed it in this session.
    useEffect(() => {
        if (activeBroadcast) {
            const dismissedId = sessionStorage.getItem('dismissedBroadcastId');
            if (activeBroadcast._id !== dismissedId) {
                setIsVisible(true);
            }
        } else {
            // If there's no active broadcast from the API, ensure the banner is hidden.
            setIsVisible(false);
        }
    }, [activeBroadcast]);

    const handleDismiss = () => {
        // When dismissed, store the ID of the current broadcast in session storage.
        if (activeBroadcast) {
            sessionStorage.setItem('dismissedBroadcastId', activeBroadcast._id);
        }
        setIsVisible(false);
    };

    const bannerVariants = {
        hidden: { y: '-100%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
        exit: { y: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <AnimatePresence>
            {isVisible && activeBroadcast && (
                <motion.div
                    key="broadcast-banner"
                    variants={bannerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative z-[100] bg-slate-800 text-white"
                >
                    <div className="container mx-auto flex items-center justify-center gap-4 px-4 py-2 text-sm text-center">
                        <Megaphone size={18} className="flex-shrink-0 text-slate-300" />
                        <span className="flex-grow">{activeBroadcast.message}</span>
                        {activeBroadcast.link && (
                            <Link to={activeBroadcast.link} className="font-bold underline hover:text-slate-200 whitespace-nowrap flex items-center gap-1">
                                Learn More <ArrowRight size={14}/>
                            </Link>
                        )}
                        <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-slate-700 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BroadcastBanner;