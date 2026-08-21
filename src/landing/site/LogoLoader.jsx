import { useEffect, useState, useRef } from "react";

export default function FulltimeLogoLoader({
  videoSrc = "/FULLTIME PHOTOGRAPHER LOGO_4K.mp4",
  onComplete,
}) {
  const [hide, setHide] = useState(false);
  const videoRef = useRef(null);

  const handleEnded = () => {
    setHide(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 700);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }

    // Safety fallback timer in case onEnded is delayed
    const timer = setTimeout(() => {
      handleEnded();
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center transition-opacity duration-700 ease-in-out ${
        hide ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
        className="w-full h-full object-contain max-w-5xl max-h-[90vh] px-4"
      />
      <button
        type="button"
        onClick={handleEnded}
        className="absolute bottom-6 right-6 text-xs text-white/60 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 cursor-pointer transition z-[100000]"
      >
        Skip
      </button>
    </div>
  );
}