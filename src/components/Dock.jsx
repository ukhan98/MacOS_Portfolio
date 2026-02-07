import { dockApps } from "#constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { Tooltip } from "react-tooltip";

const Dock = () => {
  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    // Cache the icon elements once when the component mounts
    const icons = dock.querySelectorAll(".dock-icon");

    const animateIcons = (mouseX) => {
      // Get dock offset to ensure mouseX is relative to the container
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();

        // Calculate the horizontal center point of the current icon
        const center = iconLeft - left + width / 2;

        // Determine how far the mouse is from this specific icon's center
        const distance = Math.abs(mouseX - center);

        /**
         * The Magic: Gaussian Distribution
         * This creates a bell curve. As distance increases, intensity drops
         * rapidly toward 0. 20000 controls the 'width' of the effect.
         */
        const intensity = Math.exp(-(distance ** 2.5) / 20000);

        // Apply transformations based on proximity (intensity)
        gsap.to(icon, {
          scale: 1 + 0.25 * intensity, // Max scale is 1.25 when mouse is directly over
          y: -15 * intensity, // Lift the icon up by max 15px
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      // Pass the relative X position to the animation engine
      animateIcons(e.clientX - left);
    };

    const resetIcons = () => {
      // Return all icons to their base state when mouse leaves the dock
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        }),
      );
    };

    // Standard event listeners for interaction
    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    // Cleanup to prevent memory leaks and multiple listeners
    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  const toggleApp = (app) => {
    //Open window logic
  };

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "opacity-60"}
              />
            </button>
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
