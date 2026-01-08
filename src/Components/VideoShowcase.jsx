import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, Play, Pause, SkipBack, SkipForward, Square } from 'lucide-react';
import heroVideo from '../assets/Videos/herovideo.mp4';
import SectionSeparator from './SectionSeparator';

const VideoShowcase = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <section className="video-showcase-section">
            {/* Animated Doodles */}
            <motion.svg
                width="200" height="200"
                viewBox="0 0 200 200"
                style={{ position: 'absolute', top: '-5%', left: '-5%', zIndex: 1, opacity: 0.6 }}
                animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Orange Scribbly Circle */}
                <motion.path
                    d="M 50 100 C 50 100, 40 50, 100 50 C 160 50, 150 100, 150 100 C 150 100, 160 150, 100 150 C 40 150, 50 100, 50 100 Z"
                    fill="none"
                    stroke="var(--color-orange)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
            </motion.svg>

            <motion.svg
                width="150" height="150"
                viewBox="0 0 100 100"
                style={{ position: 'absolute', bottom: '10%', right: '5%', zIndex: 1, opacity: 0.8 }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Teal Zigzag */}
                <motion.path
                    d="M 10 50 L 30 20 L 50 80 L 70 20 L 90 50"
                    fill="none"
                    stroke="var(--color-teal)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                />
            </motion.svg>
            <motion.div
                style={{ position: 'absolute', top: '45%', left: '10%', zIndex: 1 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {/* Black Sparkle */}
                <svg width="60" height="60" viewBox="0 0 50 50">
                    <path
                        d="M 25 0 L 30 20 L 50 25 L 30 30 L 25 50 L 20 30 L 0 25 L 20 20 Z"
                        fill="var(--color-black)"
                        opacity="0.2"
                    />
                </svg>
            </motion.div>

            <motion.div
                style={{ position: 'absolute', top: '15%', right: '10%', zIndex: 1 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {/* Black Sparkle */}
                <svg width="60" height="60" viewBox="0 0 50 50">
                    <path
                        d="M 25 0 L 30 20 L 50 25 L 30 30 L 25 50 L 20 30 L 0 25 L 20 20 Z"
                        fill="var(--color-black)"
                        opacity="0.2"
                    />
                </svg>
            </motion.div>

            <motion.svg
                width="300" height="100"
                viewBox="0 0 300 100"
                style={{ position: 'absolute', top: '6%', left: '30%', zIndex: 1, opacity: 0.5 }}
            >
                {/* Red Underline Swish */}
                <motion.path
                    d="M 10 50 Q 80 20 150 50 T 290 50"
                    fill="none"
                    stroke="var(--color-red)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                />
            </motion.svg>
            <SectionSeparator flip={false} />

            <div className="video-player-container">
                <div className="player-header">
                    <span className="player-brand">FilmFlare</span>
                    <div className="player-status">
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>100%</span>
                        <Battery size={18} fill="currentColor" />
                    </div>
                </div>

                <div className="video-content-wrapper">
                    <video
                        ref={videoRef}
                        className="video-element"
                        src={heroVideo}
                        loop
                        playsInline
                        onClick={togglePlay}
                    />

                    <div className="viewfinder-overlay">
                        {/* Viewfinder Corners */}
                        <div className="viewfinder-corners">
                            <div className="corner tl"></div>
                            <div className="corner tr"></div>
                            <div className="corner bl"></div>
                            <div className="corner br"></div>
                        </div>

                        {/* REC Indicator */}
                        <div className="rec-status">
                            <div className="rec-dot"></div>
                            <span>REC</span>
                        </div>

                        {/* Center Play Button */}
                        {!isPlaying && (
                            <button className="center-play-btn" onClick={togglePlay}>
                                <div className="play-icon"></div>
                            </button>
                        )}

                        {/* Video Info Overlay */}
                        <div className="video-info">
                            ISO 800  F5.6  1/50
                        </div>
                    </div>
                </div>

                <div className="player-controls">
                    <div className="control-group">
                        <SkipBack size={20} className="control-icon" />
                        {isPlaying ? (
                            <Pause size={20} className="control-icon" onClick={togglePlay} />
                        ) : (
                            <Play size={20} className="control-icon" onClick={togglePlay} />
                        )}
                        <Square size={20} className="control-icon" />
                        <SkipForward size={20} className="control-icon" />
                    </div>

                    <div className="timeline">
                        00:00:14:08
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoShowcase;
