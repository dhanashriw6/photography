import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Film, Video, Image, Sparkles, Clapperboard, Users, Award } from 'lucide-react';

const Categories = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

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

    // Calculate which category should be visible based on scroll
    const categoryCount = categories.length;
    const activeIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, categoryCount - 1]
    );

    return (
        <section
            ref={containerRef}
            style={{
                height: `${categoryCount * 100}vh`, // Make section tall enough for all categories
                position: 'relative',
                background: 'var(--color-cream)',
            }}
        >
            {/* Sticky Container */}
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
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
                    {/* Left Side - Fixed Content */}
                    <div style={{
                        flex: '0 0 45%',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                color: 'var(--color-orange)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3em',
                                display: 'block',
                                marginBottom: '2rem',
                                fontWeight: '600'
                            }}
                        >
                            CATEGORIES
                        </motion.span>

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
                        {categories.map((category, index) => {
                            // Calculate opacity and position for each card based on scroll
                            const start = index / categoryCount;
                            const end = (index + 1) / categoryCount;

                            const opacity = useTransform(
                                scrollYProgress,
                                [
                                    Math.max(0, start - 0.05),
                                    start,
                                    end,
                                    Math.min(1, end + 0.05)
                                ],
                                [0, 1, 1, 0]
                            );

                            const y = useTransform(
                                scrollYProgress,
                                [
                                    Math.max(0, start - 0.05),
                                    start,
                                    end,
                                    Math.min(1, end + 0.05)
                                ],
                                [100, 0, 0, -100]
                            );

                            const scale = useTransform(
                                scrollYProgress,
                                [
                                    Math.max(0, start - 0.05),
                                    start,
                                    end,
                                    Math.min(1, end + 0.05)
                                ],
                                [0.8, 1, 1, 0.8]
                            );

                            return (
                                <motion.div
                                    key={index}
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
                                        {/* Icon - Positioned over image */}
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

                                        {/* Content - Bottom Section */}
                                        <div style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            marginTop: 'auto',
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
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;
