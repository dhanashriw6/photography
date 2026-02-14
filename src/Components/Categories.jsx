import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Film, Video, Image, Sparkles, Clapperboard, Users, Award } from 'lucide-react';
import SectionSeparator from './SectionSeparator';

const CategoryCard = ({ category, index, categoryCount, scrollYProgress }) => {
    const start = index / categoryCount;
    const end = (index + 1) / categoryCount;
    const isLast = index === categoryCount - 1;

    const opacity = useTransform(
        scrollYProgress,
        isLast
            ? [Math.max(0, start - 0.05), start, end]
            : [Math.max(0, start - 0.05), start, end, Math.min(1, end + 0.05)],
        isLast ? [0, 1, 1] : [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        isLast
            ? [Math.max(0, start - 0.05), start, end]
            : [Math.max(0, start - 0.05), start, end, Math.min(1, end + 0.05)],
        isLast ? [100, 0, 0] : [100, 0, 0, -100]
    );

    const scale = useTransform(
        scrollYProgress,
        isLast
            ? [Math.max(0, start - 0.05), start, end]
            : [Math.max(0, start - 0.05), start, end, Math.min(1, end + 0.05)],
        isLast ? [0.8, 1, 1] : [0.8, 1, 1, 0.8]
    );

    return (
        <motion.div
            style={{
                position: 'absolute',
                width: '100%',
                maxWidth: '450px',
                opacity,
                y,
                scale
            }}
        >
            <div style={{
                background: 'white',
                borderRadius: '32px',
                padding: '0',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                height: '600px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.9)'
                }} />

                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 100%)`
                }} />

                {/* Icon */}
                <div style={{
                    position: 'absolute',
                    top: '2.5rem',
                    left: '2.5rem',
                    width: '70px',
                    height: '70px',
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    zIndex: 2
                }}>
                    {React.cloneElement(category.icon, {
                        size: 32,
                        color: category.color,
                        strokeWidth: 2.5
                    })}
                </div>

                {/* Decorative Dots */}
                <div style={{
                    position: 'absolute',
                    top: '3rem',
                    right: '3rem',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 1
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: category.color,
                        opacity: 0.6
                    }} />
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: category.color,
                        opacity: 0.3
                    }} />
                </div>

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    marginTop: 'auto',
                    marginBottom: '8%',
                    padding: '2.5rem 3rem 3rem',
                    background: 'white'
                }}>
                    <h3 style={{
                        fontSize: '2.2rem',
                        color: 'var(--color-black)',
                        fontFamily: "'Oswald', sans-serif",
                        marginBottom: '1rem',
                        fontWeight: '700',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2
                    }}>
                        {category.title}
                    </h3>
                    <p style={{
                        fontSize: '1.05rem',
                        lineHeight: 1.6,
                        color: 'var(--color-coffee)',
                        opacity: 0.7
                    }}>
                        {category.description}
                    </p>
                </div>

                {/* Bottom Accent Line */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${category.color}, transparent)`,
                    borderRadius: '0 0 32px 32px'
                }} />
            </div>
        </motion.div>
    );
};

const Categories = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Detect screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const categories = [
        {
            icon: <Camera />,
            title: "Product Photography",
            description: "Make products look premium.",
            color: "#FF8C00",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop"
        },
        {
            icon: <Film />,
            title: "Birthday & Parties",
            description: "Celebrate the moments that matter.",
            color: "#C19A6B",
            image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=800&fit=crop"
        },
        {
            icon: <Video />,
            title: "Wedding Photography",
            description: "Timeless memories, beautifully captured.",
            color: "#FF8C00",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop"
        },
        {
            icon: <Image />,
            title: "Portrait Photography",
            description: "Stunning portraits that capture personality.",
            color: "#C19A6B",
            image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=800&fit=crop"
        },
        {
            icon: <Sparkles />,
            title: "Event Coverage",
            description: "Complete coverage of your special events.",
            color: "#FF8C00",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop"
        },
        {
            icon: <Clapperboard />,
            title: "Commercial Production",
            description: "High-quality commercial content.",
            color: "#C19A6B",
            image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=800&fit=crop"
        },
        {
            icon: <Users />,
            title: "Fashion Photography",
            description: "Editorial and fashion photography.",
            color: "#FF8C00",
            image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=800&fit=crop"
        },
        {
            icon: <Award />,
            title: "Documentary Films",
            description: "Tell compelling stories through film.",
            color: "#C19A6B",
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=800&fit=crop"
        }
    ];

    const categoryCount = categories.length;

    // Mobile/Tablet: Simple grid layout, no scroll animation
    if (isMobile || isTablet) {
        return (
            <section
                style={{
                    padding: isMobile ? '4rem 1.5rem' : '6rem 2rem',
                    background: 'var(--color-cream)',
                }}
                className='categories'
            >
                <div className="container" style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%'
                }}>
                    {/* Header */}
                    <div style={{
                        marginBottom: isMobile ? '3rem' : '4rem',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                display: 'inline-block',
                                background: '#FEEFA3',
                                border: '2px solid #FFAE00',
                                borderRadius: '20% 70% 30% 70% / 30% 30% 80% 40%',
                                padding: '0.75rem 1.5rem',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#111212',
                                boxShadow: '0 0 25px rgba(255,174,0,0.4)',
                                marginBottom: '2rem'
                            }}
                        >
                            Categories
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            style={{
                                fontSize: isMobile ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 5vw, 4rem)',
                                color: 'var(--color-black)',
                                fontFamily: "'Oswald', sans-serif",
                                marginBottom: '1.5rem',
                                fontWeight: '700',
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Find photographers for every moment.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.7 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            style={{
                                fontSize: isMobile ? '0.95rem' : '1rem',
                                color: 'var(--color-coffee)',
                                lineHeight: 1.7,
                                maxWidth: isMobile ? '100%' : '500px',
                                margin: isMobile ? '0 auto' : '0'
                            }}
                        >
                            Browse our curated categories — each verified for the highest quality work.
                        </motion.p>
                    </div>

                    {/* Categories Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                        gap: isMobile ? '2rem' : '2.5rem',
                        width: '100%'
                    }}>
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: 'white',
                                    borderRadius: isMobile ? '24px' : '28px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    height: isMobile ? '400px' : '450px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {/* Background Image */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '55%',
                                    backgroundImage: `url(${category.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'brightness(0.9)'
                                }} />

                                {/* Gradient Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '55%',
                                    background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 100%)`
                                }} />

                                {/* Icon */}
                                <div style={{
                                    position: 'absolute',
                                    top: isMobile ? '1.5rem' : '2rem',
                                    left: isMobile ? '1.5rem' : '2rem',
                                    width: isMobile ? '60px' : '70px',
                                    height: isMobile ? '60px' : '70px',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    zIndex: 2
                                }}>
                                    {React.cloneElement(category.icon, {
                                        size: isMobile ? 28 : 32,
                                        color: category.color,
                                        strokeWidth: 2.5
                                    })}
                                </div>

                                {/* Decorative Dots */}
                                <div style={{
                                    position: 'absolute',
                                    top: isMobile ? '1.75rem' : '2.5rem',
                                    right: isMobile ? '1.75rem' : '2.5rem',
                                    display: 'flex',
                                    gap: '6px',
                                    zIndex: 1
                                }}>
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: category.color,
                                        opacity: 0.6
                                    }} />
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: category.color,
                                        opacity: 0.3
                                    }} />
                                </div>

                                {/* Content */}
                                <div style={{
                                    position: 'relative',
                                    zIndex: 1,
                                    marginTop: 'auto',
                                    padding: isMobile ? '2rem 1.75rem 2.5rem' : '2.5rem 2.5rem 3rem',
                                    background: 'white'
                                }}>
                                    <h3 style={{
                                        fontSize: isMobile ? '1.6rem' : '2rem',
                                        color: 'var(--color-black)',
                                        fontFamily: "'Oswald', sans-serif",
                                        marginBottom: '0.75rem',
                                        fontWeight: '700',
                                        letterSpacing: '-0.01em',
                                        lineHeight: 1.2
                                    }}>
                                        {category.title}
                                    </h3>
                                    <p style={{
                                        fontSize: isMobile ? '0.95rem' : '1rem',
                                        lineHeight: 1.6,
                                        color: 'var(--color-coffee)',
                                        opacity: 0.7
                                    }}>
                                        {category.description}
                                    </p>
                                </div>

                                {/* Bottom Accent Line */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: `linear-gradient(90deg, ${category.color}, transparent)`,
                                    borderRadius: isMobile ? '0 0 24px 24px' : '0 0 28px 28px'
                                }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Desktop: Original scroll-based animation
    return (
        <section
            ref={containerRef}
            style={{
                height: `${categoryCount * 100}vh`,
                position: 'relative',
            }}
            className='categories'
        >
            {/* Sticky Container */}
            <div style={{
                position: 'sticky',
                top: 5,
                height: '110vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <div className="container" style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 4rem',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8rem'
                }}>
                    <motion.div
                        animate={{
                            y: [-80],
                            x: [-1250],
                            rotate: [0, -8, 0],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        style={{
                            position: 'absolute',
                            top: '38%',
                            right: '6%',
                            zIndex: 5,
                            pointerEvents: 'none'
                        }}
                    >
                        <div style={{
                            background: '#FEEFA3',
                            border: '2px solid #FFAE00',
                            borderRadius: '20% 70% 30% 70% / 30% 30% 80% 40%',
                            padding: '1rem 1.8rem',
                            fontWeight: '700',
                            fontSize: '1rem',
                            color: '#111212',
                            boxShadow: '0 0 25px rgba(255,174,0,0.4)',
                            transform: 'rotate(8deg)'
                        }}>
                            Categories
                        </div>
                    </motion.div>

                    {/* Left Side - Fixed Content */}
                    <div style={{
                        flex: '0 0 45%',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                color: 'var(--color-black)',
                                fontFamily: "'Oswald', sans-serif",
                                marginBottom: '1.5rem',
                                fontWeight: '700',
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Find photographers for every moment.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.7 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            style={{
                                fontSize: '1rem',
                                color: 'var(--color-coffee)',
                                lineHeight: 1.7,
                                maxWidth: '500px'
                            }}
                        >
                            Scroll to reveal categories — each one curated and verified for the highest quality work.
                        </motion.p>
                    </div>

                    {/* Right Side - Animated Categories */}
                    <div style={{
                        flex: '0 0 45%',
                        position: 'relative',
                        height: '650px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={index}
                                category={category}
                                index={index}
                                categoryCount={categoryCount}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;