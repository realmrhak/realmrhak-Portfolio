import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { projectApi, resolveMediaUrl } from "../api/index.js";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    projectApi
      .get(id)
      .then(({ data }) => setProject(data))
      .catch((err) => {
        setError(err.response?.data?.message || "Project not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d0d0d",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Loader2 size={20} className="animate-spin" />
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d0d0d",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          fontFamily: "'Poppins', sans-serif",
          padding: 20,
          textAlign: "center",
        }}
      >
        <AlertCircle size={48} className="text-red-400" />
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>
          {error || "Project not found"}
        </h1>
        <Link
          to="/"
          style={{
            padding: "10px 20px",
            border: "1px solid #333",
            borderRadius: 8,
            color: "white",
            textDecoration: "none",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0d0d0d",
        color: "white",
        padding: "90px 16px 60px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <button
          onClick={() =>
            window.history.length > 1 ? navigate(-1) : navigate("/")
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            background: "#1a1a1a",
            color: "white",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h1
          style={{
            fontSize: "clamp(24px, 6vw, 48px)",
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {project.title}
        </h1>

        {project.image_url && (
          <img
            src={resolveMediaUrl(project.image_url)}
            alt={project.title}
            loading="lazy"
            style={{
              width: "100%",
              maxHeight: "min(360px, 50vh)",
              objectFit: "cover",
              borderRadius: 16,
              marginBottom: 24,
              border: "1px solid #2a2a2a",
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
            color: "#888",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 12,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={14} />{" "}
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString()
              : ""}
          </span>

          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Tag size={14} /> {project.tags.join(", ")}
            </span>
          )}

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "white",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "#cfcfcf",
            marginBottom: 24,
          }}
        >
          {project.description}
        </p>

        {project.long_description && (
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid #2a2a2a",
              background: "#141414",
            }}
          >
            <MarkdownRenderer source={project.long_description} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
