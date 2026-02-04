import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ✅ Capital naming for things that don’t change
const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 800, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

// ✅ Render each character as a span for individual animation
const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={`${className} inline-block`}
      style={{ fontVariationSettings: `"wght" ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

// ✅ Setup hover animations for a container (title/subtitle)
const setupTextHover = (container, type) => {
  if (!container) return;

  // ✅ shared scope for letters for both handlers
  const letters = container.querySelectorAll("span");
  if (!letters.length) return;

  const { min, max, default: defaultWeight } = FONT_WEIGHTS[type];

  // ✅ Animate a single letter: floating + weight change
  const animateLetter = (letter, weight, duration = 0.25) =>
    gsap.to(letter, {
      fontVariationSettings: `"wght" ${weight}`, // dynamic weight
      y: weight === defaultWeight ? 0 : -40, // float only when weight changes
      duration,
      ease: "power2.out", // smooth transition
    });

  // ✅ Mouse move handler: calculate proximity & intensity
  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));

      // ✅ Intensity based on distance
      const intensity = Math.exp(-(distance ** 2) / 2000);

      // ✅ Round weight to nearest integer to avoid font issues
      const weightValue = Math.round(min + (max - min) * intensity);

      animateLetter(letter, weightValue);
    });
  };

  // ✅ Mouse leave handler: reset all letters to default
  const handleMouseLeave = () => {
    letters.forEach((letter) => animateLetter(letter, defaultWeight, 0.3));
  };

  // ✅ Attach event listeners
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  // ✅ Cleanup function
  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// ✅ Main Welcome component
const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  // ✅ Setup GSAP animations once component mounts
  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      titleCleanup?.();
      subtitleCleanup?.();
    };
  }, []);

  return (
    <section id="welcome">
      {/* ✅ Subtitle */}
      <p ref={subtitleRef}>
        {renderText(
          "Hello, I'm Usman! Welcome to my",
          "text-3xl font-georama",
          100,
        )}
      </p>

      {/* ✅ Title */}
      <h1 ref={titleRef} className="mt-7">
        {renderText("Portfolio", "text-9xl italic font-georama")}
      </h1>

      {/* ✅ Small screen message */}
      <div className="small-screen">
        <p>This portfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
