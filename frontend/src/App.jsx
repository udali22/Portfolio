import React, { useState, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Phone,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  ArrowUpRight,
  Send,
  CheckCircle,
  Code2,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [educationData, setEducationData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Contact form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchExperiences();
    fetchProjects();
    fetchSkills();
    fetchEducation();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) setProfile(await res.json());
    } catch (e) {
      console.warn("Profile fallback used", e);
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experiences");
      if (res.ok) setExperiences(await res.json());
    } catch (e) {
      console.warn("Experiences fallback used", e);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) setProjects(await res.json());
    } catch (e) {
      console.warn("Projects fallback used", e);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      if (res.ok) setSkills(await res.json());
    } catch (e) {
      console.warn("Skills fallback used", e);
    }
  };

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/education");
      if (res.ok) setEducationData(await res.json());
    } catch (e) {
      console.warn("Education fallback used", e);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setFormStatus({ loading: true, success: false, message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        const data = await res.json();
        setFormStatus({
          loading: false,
          success: true,
          message: data.message || "Thank you! Your message has been sent.",
        });
        setFormState({ name: "", email: "", message: "" });
      } else {
        setFormStatus({
          loading: false,
          success: false,
          message:
            "Failed to send message. Please try again or reach out via email.",
        });
      }
    } catch {
      setFormStatus({
        loading: false,
        success: false,
        message:
          "Network error. Please email directly at maalimohamedalieng@gmail.com",
      });
    }
  };

  // Fallback defaults from official CV
  const defaultProfile = {
    name: "Mohamed Ali Maali",
    title: "Junior Software Engineer — Backend",
    headline:
      "Specialized in backend development and distributed microservices (Spring Boot, Kafka, PostgreSQL), with hands-on experience integrating AI/LLM pipelines into production.",
    summary:
      "Software engineer (Engineering Degree, ISIMG Gabès, Sept. 2026, Highest Honors / Mention Très Bien), specialized in backend development, scalable microservices, and AI/LLM production systems.",
    location: "Kébili, Tunisia / Remote",
    email: "maalimohamedalieng@gmail.com",
    phone: "+216 95 088 782",
    github_url: "https://github.com/udali22",
    linkedin_url: "https://www.linkedin.com/in/mohamed-ali-maali-478709218/",
    status_badge: "Seeking a Junior Backend / Software Engineering Role",
    highlights: [
      "Engineering Degree in Software Engineering with Highest Honors (Mention Très Bien) from ISIMG Gabès.",
      "Designed 7-service microservices platform (Spring Boot 3, Spring Cloud) with Eureka and RS256 JWT auth.",
      "Built 5-stage AI document pipelines in Python/FastAPI using LangGraph and Groq Vision LLM.",
      "Engineered real-time speech diarization and LLM summarization cutting consultation reporting time by 45%.",
    ],
  };

  const defaultExperiences = [
    {
      id: "deepshiftia",
      role: "Final-Year Internship (PFE) — Backend & AI Engineer",
      company: "DeepshiftIA",
      period: "Jan. 2026 – Jul. 2026",
      location: "Technopole Ghazala, Ariana, Tunisia",
      type: "Final-Year Internship (PFE)",
      description:
        "Designed and implemented full-stack microservices platforms and production AI systems for trade compliance and organizational maturity evaluation.",
      achievements: [
        "DocuCheck: Designed a full-stack microservices platform (Spring Boot 3, Spring Cloud, React 19/TypeScript) for AI-assisted KYC/KYB and trade-finance compliance: 7 services behind an API Gateway with Eureka discovery and RS256-signed JWT auth, each with a dedicated PostgreSQL database.",
        "Built a 5-stage AI document pipeline (Perception → Extraction → Refiner → Compliance → Control) in Python/FastAPI with LangGraph, migrating from Tesseract OCR to Groq Vision (LLM) for higher accuracy, human-in-the-loop review, full audit trail, and AML/OFAC sanctions screening (RapidFuzz).",
        "Set up real-time, event-driven communication (Kafka, Redis/TaskIQ, WebSocket) and containerized services with Docker.",
        "AiVision: Built a full-stack AI maturity-assessment platform (Node.js/Express + FastAPI + React/TypeScript) scoring organizations across 5 dimensions via a provider-agnostic LLM layer (OpenAI, Claude, Gemini, Groq, OpenRouter) producing structured, auditable 1–3 scores with confidence levels and cited evidence.",
        "Built the REST API (Express, Prisma/PostgreSQL on Supabase, JWT, RBAC), React/Recharts dashboards, audio transcription, and automated PDF reports (Puppeteer).",
      ],
      technologies: [
        "Spring Boot 3",
        "Spring Cloud",
        "FastAPI",
        "Python",
        "LangGraph",
        "Groq Vision",
        "Kafka",
        "Redis / TaskIQ",
        "WebSocket",
        "PostgreSQL",
        "Docker",
        "Node.js",
        "React 19",
      ],
    },
    {
      id: "wico-technologies",
      role: "Software Engineering Intern",
      company: "Wico Technologies",
      period: "Jul. 2025 – Sept. 2025",
      location: "Remote",
      type: "Software Engineering Internship",
      description:
        "Built the backend and mobile frontend for Louage Tunisie, a shared-taxi transit and trip coordination platform.",
      achievements: [
        "Built the backend of a shared-taxi trip management platform with Spring Boot: secured REST API, session management, Spring Security.",
        "Developed the mobile frontend (Angular/Ionic) with real-time booking and trip tracking via WebSockets.",
        "Modeled key entities (clients, drivers, trips, bookings) on MariaDB, working in Agile (Scrum).",
      ],
      technologies: [
        "Spring Boot",
        "Spring Security",
        "Angular",
        "Ionic",
        "WebSockets",
        "MariaDB",
        "Agile / Scrum",
      ],
    },
    {
      id: "tunisie-telecom",
      role: "Field Operations Intern",
      company: "Tunisie Telecom",
      period: "Jul. 2024 – Aug. 2024",
      location: "Kébili, Tunisia",
      type: "Field Operations Internship",
      description:
        "Regional telecommunication infrastructure upgrades and fiber network deployment operations.",
      achievements: [
        "Contributed to the deployment of the HUB4 infrastructure connecting 20,000+ residents in the Douz region.",
        "Assisted engineering teams with optical distribution frame routing, signal diagnostics, and physical network testing.",
      ],
      technologies: [
        "Network Infrastructure",
        "HUB4 Deployment",
        "Fiber Optics",
        "Diagnostics",
      ],
    },
  ];

  const defaultProjects = [
    {
      id: "taskflow",
      title: "TaskFlow - Real-Time Collaborative Kanban Platform",
      tagline:
        "Collaborative task orchestrator built with .NET 8, EF Core, and SignalR.",
      description:
        "Personal project featuring REST API (.NET 8/EF Core, PostgreSQL), ASP.NET Core MVC + KnockoutJS frontend, and real-time bidirectional synchronization via SignalR.",
      category: "Distributed Systems",
      technologies: [
        ".NET 8",
        "EF Core",
        "PostgreSQL",
        "ASP.NET Core MVC",
        "KnockoutJS",
        "SignalR",
      ],
      github_url: "https://github.com/udali22/TaskFlow",
    },
    {
      id: "rasmi",
      title: "Rasmi - AI-Powered Academic Email Generator",
      tagline:
        "Angular 17 + FastAPI app generating formal academic emails in French.",
      description:
        "Turns concise short intents into formal French academic emails (4 types, 3 formality levels). Features an optional local-LLM execution mode via Ollama and containerized Docker deployment.",
      category: "AI & NLP",
      technologies: ["Angular 17", "FastAPI", "Python", "Ollama", "Docker"],
      github_url: "https://github.com/udali22/Rasmi",
      demo_url: "https://rasmi-alpha.vercel.app",
    },
    {
      id: "labes-pfa",
      title: "Labes (PFA) - Real-Time AI Consultation Transcription",
      tagline:
        "Speech-to-text AI pipeline cutting physician report writing time by 45%.",
      description:
        "Fine-tuned Whisper (self-hosted) for real-time doctor-patient conversation transcription with PyAnnote speaker diarization, and an LLM generating structured summaries to assist doctors (cut report time from 20 to 11 min in tests).",
      category: "AI & Audio",
      technologies: [
        "FastAPI",
        "Whisper",
        "PyAnnote",
        "PyTorch",
        "Express.js",
        "React",
        "MySQL",
      ],
      github_url: "https://github.com/udali22/LabesSolution_Transcrition",
    },
    {
      id: "docucheck",
      title: "DocuCheck - AI-Assisted KYC/KYB & Trade-Finance Compliance",
      tagline:
        "7-service microservices architecture with 5-stage LangGraph AI pipeline.",
      description:
        "Spring Boot 3 + Spring Cloud microservices platform behind API Gateway with Eureka and RS256 JWT auth. Features a 5-stage AI document pipeline in FastAPI using Groq Vision LLM and RapidFuzz AML screening.",
      category: "Enterprise Microservices",
      technologies: [
        "Spring Boot 3",
        "Spring Cloud",
        "FastAPI",
        "LangGraph",
        "Groq Vision",
        "Kafka",
        "PostgreSQL",
        "React 19",
      ],
      github_url: "https://gitlab.com/dashboard/projects",
    },
    {
      id: "aivision",
      title: "AiVision - AI-Powered Maturity Assessment Platform",
      tagline:
        "Full-stack platform scoring organizations across 5 dimensions with multi-LLMs.",
      description:
        "Provider-agnostic LLM scoring (OpenAI, Claude, Gemini, Groq, OpenRouter) producing structured 1-3 audit scores with confidence levels, Recharts dashboards, audio transcription, and automated PDF reports.",
      category: "AI & Cloud",
      technologies: [
        "Node.js",
        "Express",
        "FastAPI",
        "React",
        "TypeScript",
        "Prisma",
        "Supabase",
      ],
      github_url: "https://gitlab.com/dashboard/projects",
    },
    {
      id: "labes-booking",
      title: "Medical Appointment Booking Application (MERN)",
      tagline:
        "High-performance booking platform with sub-200ms response times.",
      description:
        "Node.js/Express REST backend with JWT authentication and responsive Tailwind UI. Achieved a 95% booking success rate and sub-200ms API latency.",
      category: "Full-Stack Web",
      technologies: [
        "Node.js",
        "Express",
        "React",
        "Tailwind CSS",
        "JWT Auth",
        "MongoDB",
      ],
      github_url: "https://github.com/udali22/Labes_Solutions",
    },
    {
      id: "louage-tunisie",
      title: "Louage Tunisie - Intercity Shared-Taxi Platform",
      tagline: "Real-time shared-taxi booking and transit coordinator.",
      description:
        "Spring Boot backend with Spring Security, WebSocket trip tracking, and Angular/Ionic mobile application modeling clients, drivers, trips, and bookings on MariaDB.",
      category: "Mobile & Distributed",
      technologies: [
        "Spring Boot",
        "Spring Security",
        "Angular",
        "Ionic",
        "WebSockets",
        "MariaDB",
      ],
      github_url: "https://github.com/udali22/LouageTunisie",
    },
  ];

  const defaultSkills = [
    {
      category: "Backend & Microservices",
      description:
        "Enterprise APIs, distributed systems, and message-driven architectures",
      skills: [
        "Spring Boot 3",
        "Spring Cloud",
        "REST APIs",
        "FastAPI",
        "Node.js/Express",
        "Kafka",
        "WebSocket",
        ".NET 8 / EF Core",
      ],
    },
    {
      category: "Programming Languages",
      description:
        "Core languages utilized across backend services and AI pipelines",
      skills: ["Java", "Python", "JavaScript / TypeScript", "C#"],
    },
    {
      category: "Databases & Storage",
      description: "Relational data modeling, ORMs, and persistence systems",
      skills: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "MariaDB",
        "Microsoft SQL Server",
        "Prisma / Supabase",
      ],
    },
    {
      category: "AI & Machine Learning",
      description:
        "Production LLMs, vision, speech processing, and audio diarization",
      skills: [
        "LLM Integration (Groq Vision)",
        "LangGraph",
        "Transformers",
        "Whisper Fine-Tuning",
        "PyAnnote",
        "RapidFuzz",
      ],
    },
    {
      category: "Frontend & Mobile",
      description:
        "Modern component-driven web interfaces and cross-platform mobile apps",
      skills: [
        "React 19 / TypeScript",
        "Angular",
        "ASP.NET Core MVC",
        "Tailwind CSS",
        "Ionic",
      ],
    },
    {
      category: "DevOps & Engineering Practices",
      description:
        "Containerization, continuous integration, and agile delivery",
      skills: [
        "Docker",
        "Git",
        "GitHub Actions",
        "GitLab CI",
        "Agile / Scrum",
        "Unit Testing (xUnit)",
        "Postman",
      ],
    },
  ];

  const defaultEducation = {
    education: [
      {
        degree: "Engineering Degree in Software Engineering (MSc Equivalent)",
        institution: "ISIMG Gabès",
        period: "Sept. 2023 – Sept. 2026",
        honors: "Graduated with Highest Honors (Mention Très Bien)",
        details: "Yearly averages: 12.06 | 13.86 | 15.07 | 17.00 / 20",
      },
      {
        degree: "Integrated Preparatory Cycle in Computer Science",
        institution: "ISIMG Gabès",
        period: "Sept. 2021 – Jun. 2023",
        honors: "Graduated with Honors (Mention Bien)",
        details:
          "Rigorous foundation in advanced mathematics, algorithms, computer architecture, and software design.",
      },
    ],
    certifications: [
      {
        title: "Model Context Protocol",
        issuer: "Anthropic Academy",
        date: "Mar. 2026",
      },
      {
        title: "Python for Data Science",
        issuer: "IBM",
        date: "Oct. 2024",
      },
    ],
  };

  const pData = profile || defaultProfile;
  const expList = experiences.length > 0 ? experiences : defaultExperiences;
  const projectList = projects.length > 0 ? projects : defaultProjects;
  const skillGroups = skills.length > 0 ? skills : defaultSkills;
  const eduData = educationData || defaultEducation;

  const categories = ["ALL", ...new Set(projectList.map((p) => p.category))];
  const filteredProjects =
    selectedCategory === "ALL"
      ? projectList
      : projectList.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Navigation */}
      <header className="navbar">
        <div className="container nav-inner">
          <a href="#" className="nav-brand">
            <span className="brand-dot"></span>
            <span>MOHAMED ALI MAALI</span>
          </a>

          <nav className="nav-links">
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#experience" className="nav-link">
              Experience
            </a>
            <a href="#projects" className="nav-link">
              Projects
            </a>
            <a href="#skills" className="nav-link">
              Skills
            </a>
            <a href="#education" className="nav-link">
              Education
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>

          <div className="nav-socials">
            <a
              href={pData.github_url}
              target="_blank"
              rel="noreferrer"
              className="nav-social-btn"
              title="GitHub Profile"
            >
              <Github size={16} />
            </a>
            <a
              href={pData.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="nav-social-btn"
              title="LinkedIn Profile"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="#contact"
              className="btn btn-primary"
              style={{ padding: "0.45rem 1rem", fontSize: "0.85rem" }}
            >
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero / About Section */}
      <section className="hero" id="about">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>{pData.title}</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="hero-gradient">{pData.name}</span>
          </h1>

          <p className="hero-subtitle">{pData.headline}</p>

          <div className="hero-meta-bar">
            <div className="hero-meta-item">
              <GraduationCap size={16} color="var(--accent-cyan)" />
              <span>ISIMG Gabès &bull; Highest Honors (Mention Très Bien)</span>
            </div>
            <div className="hero-meta-item">
              <MapPin size={16} color="var(--accent-cyan)" />
              <span>{pData.location}</span>
            </div>
            <div className="hero-meta-item">
              <Mail size={16} color="var(--accent-cyan)" />
              <a
                href={`mailto:${pData.email}`}
                style={{ color: "var(--text-primary)" }}
              >
                {pData.email}
              </a>
            </div>
            <div className="hero-meta-item">
              <Phone size={16} color="var(--accent-cyan)" />
              <span>{pData.phone}</span>
            </div>
          </div>

          <div className="hero-actions">
            <a href="#experience" className="btn btn-primary">
              <Briefcase size={16} />
              <span>View Experience</span>
            </a>
            <a href="#projects" className="btn btn-secondary">
              <span>Explore Projects</span>
              <ArrowUpRight size={16} />
            </a>
            <a href="#contact" className="btn btn-secondary">
              <span>Contact Me</span>
            </a>
          </div>
        </div>
      </section>

      {/* Professional Experience Section (3 Internships) */}
      <section
        className="section"
        id="experience"
        style={{ backgroundColor: "rgba(14, 18, 27, 0.4)" }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// CAREER PATH</span>
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-desc">
              Hands-on engineering across enterprise microservices, autonomous
              AI document pipelines, and real-time distributed platforms.
            </p>
          </div>

          <div className="experience-list">
            {expList.map((exp) => (
              <div key={exp.id} className="experience-card">
                <div className="exp-header">
                  <div>
                    <h3 className="exp-role">{exp.role}</h3>
                    <div className="exp-company-group">
                      <span className="exp-company">{exp.company}</span>
                      <span className="exp-badge">{exp.type}</span>
                    </div>
                  </div>

                  <div className="exp-meta">
                    <div className="exp-period">{exp.period}</div>
                    <div className="exp-location">
                      <MapPin size={13} />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="exp-desc">{exp.description}</p>

                <ul className="exp-bullets">
                  {exp.achievements.map((item, idx) => (
                    <li key={idx} className="exp-bullet">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="exp-tech-tags">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="tech-tag"
                      style={{
                        background: "rgba(6, 182, 212, 0.06)",
                        borderColor: "rgba(6, 182, 212, 0.2)",
                        color: "#38bdf8",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="section" id="projects">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// PORTFOLIO WORK</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-desc">
              Production architectures, machine learning workflows, and
              distributed services.
            </p>

            {/* Filter Pills */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "0.35rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-mono)",
                    backgroundColor:
                      selectedCategory === cat
                        ? "var(--accent-cyan)"
                        : "rgba(255, 255, 255, 0.04)",
                    color:
                      selectedCategory === cat
                        ? "#041017"
                        : "var(--text-secondary)",
                    fontWeight: selectedCategory === cat ? 600 : 400,
                    border: "1px solid",
                    borderColor:
                      selectedCategory === cat
                        ? "var(--accent-cyan)"
                        : "var(--border-color)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div>
                  <div className="project-category">{project.category}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-tagline">{project.tagline}</p>
                  <p className="project-desc">{project.description}</p>
                </div>

                <div>
                  <div className="tech-tags">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link-btn"
                      >
                        {project.github_url.includes("gitlab.com") ? (
                          <Code2 size={15} color="#f97316" />
                        ) : (
                          <Github size={15} />
                        )}
                        <span>
                          {project.github_url.includes("gitlab.com")
                            ? "GitLab Project"
                            : "GitHub Repository"}
                        </span>
                        <ArrowUpRight size={13} style={{ opacity: 0.7 }} />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link-btn"
                        style={{ color: "var(--accent-cyan)" }}
                      >
                        <ExternalLink size={15} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section
        className="section"
        id="skills"
        style={{ backgroundColor: "rgba(14, 18, 27, 0.4)" }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// COMPETENCIES</span>
            <h2 className="section-title">Technical Expertise</h2>
            <p className="section-desc">
              Core technologies utilized across backend microservices,
              distributed systems, and AI pipelines.
            </p>
          </div>

          <div className="skills-grid">
            {skillGroups.map((group, idx) => (
              <div key={idx} className="skill-category-card">
                <h3 className="skill-cat-title">{group.category}</h3>
                <p className="skill-cat-desc">{group.description}</p>
                <div className="skill-pills">
                  {group.skills.map((s) => (
                    <span key={s} className="skill-pill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section className="section" id="education">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// ACADEMICS & CERTIFICATIONS</span>
            <h2 className="section-title">Education & Credentials</h2>
            <p className="section-desc">
              Rigorous engineering education at ISIMG Gabès and specialized
              professional certifications.
            </p>
          </div>

          <div className="education-grid">
            {eduData.education.map((item, idx) => (
              <div key={idx} className="edu-card">
                <span className="edu-badge">{item.honors}</span>
                <h3 className="edu-degree">{item.degree}</h3>
                <div className="edu-institution">{item.institution}</div>
                <div className="edu-period">{item.period}</div>
                {item.details && <p className="edu-details">{item.details}</p>}
              </div>
            ))}
          </div>

          {/* Certifications Block */}
          {eduData.certifications && eduData.certifications.length > 0 && (
            <div className="cert-card-group">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <Award size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: "1.15rem" }}>
                  Professional Certifications
                </h3>
              </div>
              <div className="cert-list">
                {eduData.certifications.map((cert, idx) => (
                  <div key={idx} className="cert-item">
                    <div>
                      <div className="cert-title">{cert.title}</div>
                      <div className="cert-issuer">{cert.issuer}</div>
                    </div>
                    <div className="cert-date">{cert.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="section"
        id="contact"
        style={{ backgroundColor: "rgba(14, 18, 27, 0.4)" }}
      >
        <div className="container">
          <div className="contact-container">
            <div>
              <span className="section-tag">// CONNECT</span>
              <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                Let's Discuss Opportunities
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "1.75rem",
                  lineHeight: 1.7,
                }}
              >
                Actively seeking a{" "}
                <strong>Junior Backend / Software Engineering role</strong>.
                Whether you have an open position, an AI or distributed systems
                project, or would like to discuss my work, feel free to reach
                out.
              </p>

              <div className="contact-info-list">
                <a
                  href={`mailto:${pData.email}`}
                  className="contact-info-link"
                  title="Send email"
                >
                  <Mail size={18} color="var(--accent-cyan)" />
                  <span>{pData.email}</span>
                </a>
                <a
                  href={`tel:${pData.phone}`}
                  className="contact-info-link"
                  title="Call phone"
                >
                  <Phone size={18} color="var(--accent-cyan)" />
                  <span>{pData.phone}</span>
                </a>
                <div className="contact-info-link">
                  <MapPin size={18} color="var(--accent-cyan)" />
                  <span>{pData.location}</span>
                </div>
              </div>

              <div
                style={{ display: "flex", gap: "1rem", marginTop: "2.25rem" }}
              >
                <a
                  href={pData.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "0.65rem 1.15rem" }}
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </a>
                <a
                  href={pData.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "0.65rem 1.15rem" }}
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleContactSubmit} className="contact-form">
              {formStatus.success && (
                <div className="success-alert">
                  <CheckCircle
                    size={16}
                    style={{
                      display: "inline",
                      marginRight: "0.5rem",
                      verticalAlign: "middle",
                    }}
                  />
                  {formStatus.message}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. Hiring Manager / Recruiter"
                  className="form-input"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="recruiter@company.com"
                  className="form-input"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Describe the opportunity, role requirements, or collaboration..."
                  className="form-textarea"
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus.loading}
                className="btn btn-primary"
                style={{
                  alignSelf: "flex-start",
                  opacity: formStatus.loading ? 0.7 : 1,
                }}
              >
                <Send size={15} />
                <span>
                  {formStatus.loading ? "Sending..." : "Send Message"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            &copy; {new Date().getFullYear()} Mohamed Ali Maali &bull; Junior
            Software Engineer — Backend
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            <a
              href={pData.github_url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-secondary)" }}
            >
              GitHub
            </a>
            <a
              href={pData.linkedin_url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-secondary)" }}
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${pData.email}`}
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
