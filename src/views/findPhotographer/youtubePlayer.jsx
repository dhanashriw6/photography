import { useState, useRef } from "react";

// Replace this with your own video URL or local file path e.g. "/videos/myvideo.mp4"
const VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        playing ? videoRef.current.pause() : videoRef.current.play();
        setPlaying(p => !p);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !muted;
        setMuted(m => !m);
    };

    return (
        <section style={{
            padding: "72px 40px",
            background: "#f5f4f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <h2 style={{
                textAlign: "center",
                fontSize: '60px',
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 40px",

            }}>
                Behind The Lens
            </h2>

            {/* Player wrapper */}
            <div style={{
                width: "100%",
                maxWidth: "860px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
                border: "3px solid #E8A317",
                background: "#000",
                aspectRatio: "16/9",
            }}>
                <video
                    ref={videoRef}
                    src={VIDEO_URL}
                    controls
                    style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                />
            </div>

         

            
        </section>
    );
};

export default VideoPlayer;