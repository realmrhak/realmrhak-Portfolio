import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code, Award, Globe, FileText, ArrowUpRight } from "lucide-react";
import { projectApi, certificateApi } from "../../api/index.js";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 35, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: 70, rotate: 2 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const pop = {
  hidden: { opacity: 0, scale: 0.92, y: 25 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function About() {
  const [isMobile, setIsMobile] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    fetchStats();
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchStats = async () => {
    try {
      const [p, c] = await Promise.all([
        projectApi.list(),
        certificateApi.list(),
      ]);
      setProjectCount(p.data.length);
      setCertificateCount(c.data.length);
    } catch {
      setProjectCount(0);
      setCertificateCount(0);
    }
  };

  const scrollToPortfolio = () => {
    const el = document.getElementById("portfolio");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (isMobile === null) return null;

  const stats = [
    {
      icon: <Code size={16} />,
      value: String(projectCount),
      title: "PROJECTS",
    },
    {
      icon: <Award size={16} />,
      value: String(certificateCount),
      title: "CERTIFICATES",
    },
    {
      icon: <Globe size={16} />,
      value: String(projectCount + certificateCount),
      title: "COMPLETED WORKS",
    },
  ];

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        padding: isMobile ? "70px 20px 40px" : "80px 60px 30px 120px",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: isMobile ? "24px" : "32px",
          }}
        >
          {/* LEFT */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-80px" }}
            style={{ maxWidth: isMobile ? "100%" : "600px", width: "100%" }}
          >
            <motion.div
              variants={fadeUp}
              style={{ marginBottom: isMobile ? 12 : 16 }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: isMobile ? 11 : 12,
                  color: "var(--text-muted)",
                  letterSpacing: "0.2em",
                }}
              >
                ABOUT ME
              </span>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div
                style={{
                  fontSize: isMobile
                    ? "clamp(30px, 10vw, 40px)"
                    : "clamp(32px,5vw,46px)",
                  fontWeight: 800,
                  lineHeight: 1.03,
                  color: "var(--text-primary)",
                }}
              >
                <div>Haroon</div>
                <div>Ameer</div>
                <div>Khan</div>
              </div>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.1, delay: 0.2 },
                },
              }}
              style={{
                marginTop: isMobile ? 14 : 18,
                fontSize: isMobile ? 13 : 14,
                color: "var(--text-secondary)",
                lineHeight: isMobile ? 1.7 : 1.75,
                maxWidth: isMobile ? "100%" : "490px",
              }}
            >
              I'm a Full-Stack Developer specializing in the MERN stack
              (MongoDB, Express, React, Node.js) with JavaScript and TypeScript.
              I love building clean, responsive UIs with React and Tailwind,
              designing robust REST APIs with Express, and modelling data in
              MongoDB. Always shipping, always learning — currently exploring
              Next.js, Docker, and cloud deployment.
            </motion.p>

            {/* QUOTE */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.94 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.9, delay: 0.3 },
                },
              }}
              style={{
                marginTop: 18,
                padding: "12px 25px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                fontSize: 12,
                fontStyle: "italic",
                display: "inline-block",
                width: "fit-content",
              }}
            >
              "Turning ideas into fast, scalable, and meaningful web
              experiences."
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                gap: 10,
                marginTop: 18,
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://drive.google.com/file/d/1NW5ND6QWgtX8-U04fPeYTVXl8EL3rfHR/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "9px 14px" : "10px 18px",
                    borderRadius: 8,
                    border: "1px solid white",
                    background: "white",
                    color: "black",
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "transform 0.25s ease, opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.03)";
                    e.currentTarget.style.opacity = "0.92";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <FileText size={14} />
                  Download CV
                </button>
              </a>

              <button
                onClick={scrollToPortfolio}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: isMobile ? "9px 14px" : "10px 18px",
                  borderRadius: 8,
                  border: "1px solid white",
                  background: "transparent",
                  color: "white",
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.03)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <ArrowUpRight size={14} />
                View Projects
              </button>
            </motion.div>
          </motion.div>

          {/* IMAGE */}
          {!isMobile && (
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false }}
              style={{
                width: "48%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  transform: "translateX(-80px)",
                }}
              >
                <img
                  src="/assets/haroon.png"
                  alt="Haroon Ameer Khan"
                  loading="lazy"
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* CARDS */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
            gap: isMobile ? 10 : 18,
            marginTop: isMobile ? 28 : 36,
          }}
        >
          {stats.map((item, i) => (
            <motion.div
              key={i}
              variants={pop}
              whileHover={{ scale: 1.03 }}
              style={{
                position: "relative",
                padding: isMobile ? 14 : 18,
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                cursor: "pointer",
                minHeight: isMobile ? 110 : "auto",
              }}
            >
              <div
                style={{
                  width: isMobile ? 28 : 34,
                  height: isMobile ? 28 : 34,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: 700,
                }}
              >
                {item.value}
              </div>

              <div
                style={{ fontSize: isMobile ? 9 : 11, letterSpacing: "0.08em" }}
              >
                {item.title}
              </div>

              <div
                onClick={scrollToPortfolio}
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  cursor: "pointer",
                }}
              >
                <ArrowUpRight size={15} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
