import { useEffect, useState } from "react";
import "./FulltimeLogoLoader.css";
import finalLogo from "@/assets/Images/Final-logo.png";

export default function FulltimeLogoLoader({
  logoSrc = finalLogo,
  onComplete,
}) {
  const [hide, setHide] = useState(false);
console.log(finalLogo);
  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 650);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`ft-loader ${hide ? "ft-loader--hide" : ""}`}>
      <div className="ft-loader-bg" />

      <div className="ft-loader-logo-wrap">
        {/* Animated icon build */}
        <div className="ft-icon-build" aria-hidden="true">
          <span className="ft-icon-dot" />
          <span className="ft-icon-top" />
          <span className="ft-icon-main" />
          <span className="ft-icon-leg" />
        </div>

        {/* Final exact logo */}
        <img
          src={logoSrc}
          alt="Fulltime Photographers"
          className="ft-final-logo"
        />

        {/* Loading line */}
        <div className="ft-loader-line">
          <span />
        </div>
      </div>
    </div>
  );
}