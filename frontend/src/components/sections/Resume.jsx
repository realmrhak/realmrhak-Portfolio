import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, MapPin, Calendar } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============== EXPERIENCE DATA (from resume) ==============
const experiences = [
  {
    role: "Backend AI Engineer Intern",
    company: "FlyRank AI",
    period: "Jun 2026 – Present",
    location: "Lahore, Pakistan · Remote",
    points: [
      "Developing backend AI systems including REST API development and AI model integration for production-level features.",
      "Contributing to real-world data pipelines and AI-powered automation workflows in a fast-paced startup environment.",
      "Collaborating with senior engineers on system architecture decisions and API design for scalable AI services.",
      "Writing clean, maintainable backend code following industry best practices and production deployment standards.",
    ],
  },
  {
    role: "Full Stack Developer Intern",
    company: "MJ Programmers",
    period: "Jan 2026 – Apr 2026",
    location: "Lahore, Pakistan · On-site",
    points: [
      "Built responsive React.js frontend interfaces ensuring seamless cross-device user experience across all screen sizes.",
      "Developed reusable UI components with clean REST API integrations, reducing feature development time by 30%.",
      "Collaborated in Agile sprints — code reviews, daily standups, and sprint planning with cross-functional team.",
      "Optimized application performance and UX by identifying bottlenecks and implementing targeted frontend improvements.",
    ],
  },
];

// ============== EDUCATION DATA (from resume) ==============
const educations = [
  {
    degree: "Bachelor of Computer Science",
    institution: "Government College University, Faisalabad",
    period: "Nov 2022 – Aug 2026",
    detail:
      "Major: Computer Science · Full-stack development, algorithms, data structures, and software engineering.",
  },
  {
    degree: "Intermediate (ICS)",
    institution: "Aspire College, Lahore",
    period: "May 2020 – Oct 2022",
    detail:
      "Pre-engineering studies with strong foundation in mathematics and sciences.",
  },
];

export default function ResumeSection() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return null;

  return (
    <section
      id="resume"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        padding: isMobile ? "0px 20px 40px" : "80px 60px 60px 120px",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* SECTION HEADING */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-80px" }}
          style={{ marginBottom: isMobile ? 28 : 40 }}
        >
          <motion.div
            variants={fadeUp}
            style={{ marginBottom: isMobile ? 10 : 12 }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: isMobile ? 11 : 12,
                color: "var(--text-muted)",
                letterSpacing: "0.2em",
              }}
            >
              MY JOURNEY
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            style={{
              fontSize: isMobile
                ? "clamp(28px, 9vw, 36px)"
                : "clamp(32px,5vw,46px)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}
          >
            Education & Experience
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: isMobile ? 13 : 14,
              color: "var(--text-secondary)",
              lineHeight: isMobile ? 1.7 : 1.75,
              maxWidth: isMobile ? "100%" : "560px",
            }}
          >
            My academic foundation and professional internships — building
            real-world full-stack applications in fast-paced startup
            environments.
          </motion.p>
        </motion.div>

        {/* TWO-COLUMN GRID: Experience on left, Education on right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
            gap: isMobile ? 28 : 36,
            alignItems: "flex-start",
          }}
        >
          {/* ============== EXPERIENCE ============== */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-60px" }}
          >
            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: isMobile ? 18 : 22,
              }}
            >
              <div
                style={{
                  width: isMobile ? 34 : 38,
                  height: isMobile ? 34 : 38,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Briefcase size={isMobile ? 14 : 16} />
              </div>
              <h3
                style={{
                  fontSize: isMobile ? 18 : 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Work Experience
              </h3>
            </motion.div>

            {/* TIMELINE */}
            <div
              style={{ position: "relative", paddingLeft: isMobile ? 18 : 22 }}
            >
              {/* vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  top: 8,
                  bottom: 8,
                  width: 1,
                  background: "var(--border)",
                }}
              />

              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  style={{
                    position: "relative",
                    marginBottom:
                      i === experiences.length - 1 ? 0 : isMobile ? 20 : 28,
                  }}
                >
                  {/* dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: isMobile ? -18 : -22,
                      top: 6,
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: "var(--text-primary)",
                      border: "2px solid var(--bg-primary)",
                      boxShadow: "0 0 0 1px var(--border)",
                    }}
                  />

                  <div
                    style={{
                      padding: isMobile ? 14 : 18,
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: isMobile ? 8 : 12,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: isMobile ? 14 : 15,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.3,
                        }}
                      >
                        {exp.role}
                      </h4>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: isMobile ? 10 : 11,
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Calendar size={isMobile ? 10 : 11} />
                        {exp.period}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: isMobile ? 12 : 13,
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      {exp.company}
                    </div>

                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: isMobile ? 10 : 11,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: isMobile ? 10 : 12,
                      }}
                    >
                      <MapPin size={isMobile ? 9 : 10} />
                      {exp.location}
                    </div>

                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: isMobile ? 5 : 6,
                      }}
                    >
                      {exp.points.map((point, j) => (
                        <li
                          key={j}
                          style={{
                            fontSize: isMobile ? 11.5 : 12.5,
                            color: "var(--text-secondary)",
                            lineHeight: isMobile ? 1.55 : 1.6,
                            paddingLeft: 14,
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 7,
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "var(--text-muted)",
                            }}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ============== EDUCATION ============== */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-60px" }}
          >
            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: isMobile ? 18 : 22,
              }}
            >
              <div
                style={{
                  width: isMobile ? 34 : 38,
                  height: isMobile ? 34 : 38,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GraduationCap size={isMobile ? 14 : 16} />
              </div>
              <h3
                style={{
                  fontSize: isMobile ? 18 : 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Education
              </h3>
            </motion.div>

            {/* TIMELINE */}
            <div
              style={{ position: "relative", paddingLeft: isMobile ? 18 : 22 }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  top: 8,
                  bottom: 8,
                  width: 1,
                  background: "var(--border)",
                }}
              />

              {educations.map((edu, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  style={{
                    position: "relative",
                    marginBottom:
                      i === educations.length - 1 ? 0 : isMobile ? 18 : 22,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: isMobile ? -18 : -22,
                      top: 6,
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: "var(--text-primary)",
                      border: "2px solid var(--bg-primary)",
                      boxShadow: "0 0 0 1px var(--border)",
                    }}
                  />

                  <div
                    style={{
                      padding: isMobile ? 14 : 18,
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: isMobile ? 10 : 11,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: isMobile ? 6 : 8,
                      }}
                    >
                      <Calendar size={isMobile ? 10 : 11} />
                      {edu.period}
                    </span>

                    <h4
                      style={{
                        fontSize: isMobile ? 14 : 15,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {edu.degree}
                    </h4>

                    <div
                      style={{
                        fontSize: isMobile ? 12 : 13,
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        marginBottom: isMobile ? 6 : 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <MapPin size={isMobile ? 10 : 11} />
                      {edu.institution}
                    </div>

                    <p
                      style={{
                        fontSize: isMobile ? 11.5 : 12.5,
                        color: "var(--text-secondary)",
                        lineHeight: isMobile ? 1.55 : 1.6,
                      }}
                    >
                      {edu.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
