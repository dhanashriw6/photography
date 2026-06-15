import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, Video, Image, Sparkles, Clapperboard, Users, Award } from 'lucide-react';

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

const Categories = () => {
    return (
        <section
            id="categories"
            className="categories"
            style={{
                padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 4rem)',
                background: 'var(--color-cream)',
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            display: 'inline-block',
                            background: '#FEEFA3',
                            border: '2px solid #FFAE00',
                            borderRadius: '20% 70% 30% 70% / 30% 30% 80% 40%',
                            padding: '0.6rem 1.4rem',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#111212',
                            boxShadow: '0 0 25px rgba(255,174,0,0.4)',
                            marginBottom: '1.5rem'
                        }}
                    >
                        Categories
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                            color: 'var(--color-black)',
                            fontFamily: "'Oswald', sans-serif",
                            marginBottom: '1rem',
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
                            maxWidth: '480px',
                            margin: '0 auto'
                        }}
                    >
                        Browse our curated categories — each verified for the highest quality work.
                    </motion.p>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                    gap: 'clamp(1.25rem, 2vw, 2rem)',
                }}>
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: (index % 3) * 0.08 }}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                height: '180px',
                                backgroundImage: `url(${category.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                flexShrink: 0,
                            }} />

                            {/* Content */}
                            <div style={{
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                flex: 1,
                            }}>
                                {/* Icon */}
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: `${category.color}18`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {React.cloneElement(category.icon, {
                                        size: 20,
                                        color: category.color,
                                        strokeWidth: 2,
                                    })}
                                </div>

                                <div>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        color: 'var(--color-black)',
                                        fontFamily: "'Oswald', sans-serif",
                                        fontWeight: '600',
                                        letterSpacing: '-0.01em',
                                        lineHeight: 1.2,
                                        marginBottom: '0.35rem',
                                    }}>
                                        {category.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                        color: 'var(--color-coffee)',
                                        opacity: 0.7,
                                        margin: 0,
                                    }}>
                                        {category.description}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom accent */}
                            <div style={{
                                height: '3px',
                                background: `linear-gradient(90deg, ${category.color}, transparent)`,
                            }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;