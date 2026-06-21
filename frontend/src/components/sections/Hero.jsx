import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import TextType from "../band/TextType.jsx";

// Lazy-load the heavy 3D scene — it pulls in three.js + rapier + meshline (~1MB+)
const Band3D = lazy(() => import("../band/App.jsx"));

const skills = [
  "MongoDB",
  "Express",
  "React",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "Tailwind",
];

export default function Hero({ showApp }) {
  const [startAnim, setStartAnim] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const heroPlayed = sessionStorage.getItem("heroPlayed");

    if (heroPlayed === "true") {
      setStartAnim(true);
      return;
    }

    const delay = 3600;
    const textTimer = setTimeout(() => setStartAnim(true), delay);
    const appTimer = setTimeout(() => {
      sessionStorage.setItem("heroPlayed", "true");
    }, delay + 1500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(appTimer);
    };
  }, []);

  return (
    <section
      id="home"
      className="px-5 sm:px-6 md:pl-[120px] md:pr-[60px]"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
        paddingTop: isMobile ? "90px" : 0,
      }}
    >
      {/* APP LAYER (3D Card) — only render on desktop, lazy-loaded */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 40,
          pointerEvents: showApp ? "auto" : "none",
        }}
      >
        {showApp && !isMobile && (
          <Suspense fallback={null}>
            <Band3D />
          </Suspense>
        )}
      </div>

      {/* MOBILE PROFILE PHOTO — smaller and repositioned to avoid overlap */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={
            startAnim
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.85, y: 30 }
          }
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            right: 98,
            top: 80,
            width: 230,
            height: 230,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            padding: 4,
            background: "var(--bg-card)",
            zIndex: 6,
          }}
        >
          <img
            src="/assets/haroon.png"
            alt="Haroon Ameer Khan"
            width={70}
            height={70}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </motion.div>
      )}

      {/* TEXT */}
      <div
        className="md:max-w-[600px]"
        style={{
          width: "100%",
          position: "relative",
          zIndex: 5,
          marginTop: 195,
        }}
      >
        {/* LABEL */}
        <motion.div
          initial={false}
          animate={
            startAnim
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 30, filter: "blur(12px)" }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: isMobile ? 14 : 20 }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 10 : 12,
              color: "var(--text-muted)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            ✦ Available for work
          </span>
        </motion.div>

        {/* HEADING */}
        <div>
          <motion.h1
            initial={false}
            animate={
              startAnim
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.85, y: 50 }
            }
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: isMobile
                ? "clamp(32px, 11vw, 44px)"
                : "clamp(32px, 6vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: 0,
            }}
          >
            Full-Stack
          </motion.h1>

          <motion.h1
            initial={false}
            animate={
              startAnim
                ? { opacity: 1, x: 0, rotate: 0 }
                : { opacity: 0, x: -80, rotate: -4 }
            }
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: isMobile
                ? "clamp(32px, 11vw, 44px)"
                : "clamp(32px, 6vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "var(--text-secondary)",
              letterSpacing: "-0.03em",
              marginBottom: isMobile ? 18 : 24,
            }}
          >
            Developer
          </motion.h1>
        </div>

        {/* STATUS */}
        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ marginBottom: isMobile ? 10 : 12 }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 12 : 15,
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
              display: "inline-block",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <TextType
              text={[
                "MERN Stack Developer",
                "JavaScript Enthusiast",
                "Always Learning",
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              cursorBlinkDuration={0.5}
            />
          </span>
        </motion.div>

        {/* DESC */}
        <motion.div
          initial={false}
          animate={
            startAnim
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 50, scale: 0.96 }
          }
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            marginBottom: isMobile ? 20 : 28,
            width: "100%",
            maxWidth: isMobile ? "100%" : 460,
          }}
        >
          <p
            style={{
              fontSize: isMobile ? 13 : 14,
              color: "var(--text-secondary)",
              lineHeight: isMobile ? 1.7 : 1.9,
              letterSpacing: "0.01em",
              textWrap: "pretty",
            }}
          >
            I build modern, fast, and scalable web applications using the MERN
            stack. From clean REST APIs to polished React UIs, I turn ideas into
            production-ready products that users love.
          </p>
        </motion.div>

        {/* SKILLS */}
        <motion.div
          initial="hidden"
          animate={startAnim ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12, delayChildren: 0.7 },
            },
          }}
          style={{
            display: "flex",
            gap: isMobile ? 6 : 8,
            flexWrap: "wrap",
            marginBottom: isMobile ? 22 : 28,
          }}
        >
          {skills.map((skill) => (
            <motion.span
              key={skill}
              variants={{
                hidden: { opacity: 0, y: 25, scale: 0.85 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: isMobile ? 10 : 11,
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: isMobile ? "4px 10px" : "5px 12px",
                backgroundColor: "var(--bg-card)",
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        {/* FOOTER */}
        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 11 : 13,
              color: "var(--text-muted)",
            }}
          >
            ↓ explore my work below
          </span>

          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 11 : 13,
              color: "var(--text-muted)",
            }}
          >
            ↗ open to full-time & freelance opportunities
          </span>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={false}
        animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          bottom: isMobile ? 24 : 38,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [1, 0.65, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center gap-2"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 10 : 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Scroll
          </span>

          <span
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              lineHeight: 1,
            }}
          >
            ↓
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
