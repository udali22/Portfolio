import os
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Application metadata
APP_NAME = os.getenv("APP_NAME", "Mohamed Ali Maali | Portfolio API")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:80,http://localhost"
).split(",")

app = FastAPI(
    title=APP_NAME,
    version="1.0.0",
    description="Production API serving Mohamed Ali Maali's software engineering portfolio.",
    docs_url="/docs",
    redoc_url=None,
)

# Configure CORS for local development and container communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Start time tracking
START_TIME = time.time()


# ==========================================
# Data Models
# ==========================================
class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    uptime_seconds: float
    timestamp: float


class ProfileData(BaseModel):
    name: str
    title: str
    headline: str
    summary: str
    location: str
    email: str
    phone: str
    github_url: str
    linkedin_url: str
    status_badge: str
    highlights: List[str]


class Experience(BaseModel):
    id: str
    role: str
    company: str
    period: str
    location: str
    type: str
    description: str
    achievements: List[str]
    technologies: List[str]


class Project(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    category: str
    technologies: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: bool = True


class EducationItem(BaseModel):
    degree: str
    institution: str
    period: str
    honors: str
    details: Optional[str] = None


class CertificationItem(BaseModel):
    title: str
    issuer: str
    date: str


class SkillGroup(BaseModel):
    category: str
    description: str
    skills: List[str]


class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    subject: Optional[str] = Field(None, max_length=150)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    success: bool
    message: str
    received_name: str


# ==========================================
# In-Memory Portfolio Data (From Official CV)
# ==========================================
PORTFOLIO_PROFILE = ProfileData(
    name="Mohamed Ali Maali",
    title="Junior Software Engineer — Backend",
    headline="Specialized in backend development, distributed microservices (Spring Boot, Kafka, PostgreSQL), and AI/LLM production integration.",
    summary=(
        "Software Engineer (Engineering Degree, ISIMG Gabès, Sept. 2026, Highest Honors / Mention Très Bien), "
        "specialized in resilient backend systems, distributed microservices, and practical AI/LLM pipelines. "
        "Hands-on experience architecting multi-service platforms, event-driven pipelines, and LLM integrations in production."
    ),
    location="Kébili, Tunisia / Remote",
    email="maalimohamedalieng@gmail.com",
    phone="+216 95 088 782",
    github_url="https://github.com/udali22",
    linkedin_url="https://www.linkedin.com/in/mohamed-ali-maali-478709218/",
    status_badge="Open to Software Engineering & Backend Roles",
    highlights=[
        "Engineering Degree with Highest Honors (Mention Très Bien) from ISIMG Gabès.",
        "Architected 7 microservices behind Spring Cloud Gateway with Eureka & RS256 JWT auth.",
        "Built 5-stage AI document pipelines in FastAPI with LangGraph, Groq Vision, and Kafka.",
        "Engineered real-time Whisper speech diarization and LLM summarization cutting consultation reporting by 45%."
    ]
)

PORTFOLIO_EXPERIENCES: List[Experience] = [
    Experience(
        id="deepshiftia",
        role="Final-Year Internship (PFE) — Backend & AI Engineer",
        company="DeepshiftIA",
        period="Jan. 2026 – Jul. 2026",
        location="Technopole Ghazala, Ariana, Tunisia",
        type="PFE Internship",
        description=(
            "Designed and built enterprise microservices platforms and production AI systems "
            "for KYC/KYB trade-finance compliance (DocuCheck) and organizational AI maturity assessment (AiVision)."
        ),
        achievements=[
            "DocuCheck: Designed a full-stack microservices platform (Spring Boot 3, Spring Cloud, React 19/TypeScript) with 7 services behind an API Gateway with Eureka discovery and RS256-signed JWT auth, each with a dedicated PostgreSQL database.",
            "Built a 5-stage AI document pipeline (Perception → Extraction → Refiner → Compliance → Control) in Python/FastAPI with LangGraph, migrating from Tesseract OCR to Groq Vision (LLM) for higher accuracy, human-in-the-loop review, full audit trail, and AML/OFAC sanctions screening (RapidFuzz).",
            "Set up real-time event-driven communication (Kafka, Redis/TaskIQ, WebSocket) and containerized services with Docker.",
            "AiVision: Built a full-stack AI maturity-assessment platform (Node.js/Express + FastAPI + React/TypeScript) scoring organizations across 5 dimensions via a provider-agnostic LLM layer (OpenAI, Claude, Gemini, Groq, OpenRouter) producing structured, auditable 1–3 scores with confidence levels and cited evidence.",
            "Built the REST API (Express, Prisma/PostgreSQL on Supabase, JWT, RBAC), React/Recharts dashboards, audio transcription, and automated PDF reports (Puppeteer)."
        ],
        technologies=[
            "Spring Boot 3", "Spring Cloud", "FastAPI", "Python", "LangGraph", "Groq Vision",
            "Kafka", "Redis / TaskIQ", "WebSocket", "PostgreSQL", "Docker", "Node.js", "React 19"
        ]
    ),
    Experience(
        id="wico-technologies",
        role="Software Engineering Intern",
        company="Wico Technologies",
        period="Jul. 2025 – Sept. 2025",
        location="Remote",
        type="Summer Internship",
        description=(
            "Engineered the backend and mobile interface for Louage Tunisie, a shared-taxi trip management "
            "and intercity transit platform."
        ),
        achievements=[
            "Built the backend of a shared-taxi trip management platform with Spring Boot: secured REST API, session management, and Spring Security.",
            "Developed the mobile frontend (Angular/Ionic) with real-time booking and trip tracking via WebSockets.",
            "Modeled key business entities (clients, drivers, trips, bookings) on MariaDB, operating in an Agile (Scrum) sprint methodology."
        ],
        technologies=["Spring Boot", "Spring Security", "Angular", "Ionic", "WebSockets", "MariaDB", "Scrum"]
    ),
    Experience(
        id="tunisie-telecom",
        role="Field Operations Intern",
        company="Tunisie Telecom",
        period="Jul. 2024 – Aug. 2024",
        location="Kébili, Tunisia",
        type="Field Internship",
        description=(
            "Participated in regional telecommunication network infrastructure upgrades and fiber network operations."
        ),
        achievements=[
            "Contributed to the deployment and verification of the HUB4 infrastructure connecting 20,000+ residents in the Douz region.",
            "Assisted network engineers with optical distribution frame routing, signal diagnostics, and physical network testing."
        ],
        technologies=["Network Infrastructure", "HUB4 Deployment", "Fiber Optics", "Routing & Diagnostics"]
    )
]

PORTFOLIO_PROJECTS: List[Project] = [
    Project(
        id="taskflow",
        title="TaskFlow - Real-time Collaborative Kanban Platform",
        tagline="Real-time collaborative Kanban platform built with .NET 8 and SignalR.",
        description=(
            "Collaborative task and workflow orchestrator featuring real-time synchronization "
            "via SignalR, robust relational persistence with Entity Framework Core, and modern dynamic client interfaces."
        ),
        category="Distributed Systems",
        technologies=[".NET 8", "EF Core", "PostgreSQL", "ASP.NET Core MVC", "KnockoutJS", "SignalR"],
        github_url="https://github.com/udali22/TaskFlow",
        demo_url=None,
        featured=True
    ),
    Project(
        id="rasmi",
        title="Rasmi - AI-Powered Academic Email Generator",
        tagline="AI-powered academic email generator with 4 types and 3 formality levels.",
        description=(
            "Angular 17 + FastAPI application turning concise short intents into formal French academic emails. "
            "Includes optional local-LLM execution via Ollama and containerized Docker deployment."
        ),
        category="AI & NLP",
        technologies=["FastAPI", "Python", "Angular 17", "Ollama", "Docker", "Vercel"],
        github_url="https://github.com/udali22/Rasmi",
        demo_url="https://rasmi-alpha.vercel.app",
        featured=True
    ),
    Project(
        id="labes-pfa",
        title="Labes (PFA) - Real-Time AI Consultation Transcription",
        tagline="Speech-to-text AI pipeline cutting physician report time by 45%.",
        description=(
            "Fine-tuned Whisper (self-hosted) for real-time doctor-patient conversation transcription with PyAnnote "
            "speaker diarization, and an LLM generating structured summaries to assist doctors (cut report time from 20 to 11 min in physician tests)."
        ),
        category="AI & Audio Processing",
        technologies=["FastAPI", "Whisper", "PyAnnote", "Express.js", "React", "MySQL", "PyTorch"],
        github_url="https://github.com/udali22/LabesSolution_Transcrition",
        demo_url=None,
        featured=True
    ),
    Project(
        id="docucheck",
        title="DocuCheck - AI-Assisted KYC/KYB Platform",
        tagline="7-service microservices platform for compliance and trade-finance verification.",
        description=(
            "Microservices architecture with Spring Cloud, Eureka discovery, RS256 JWT auth, and a 5-stage "
            "LangGraph AI document pipeline integrating Groq Vision LLM and automated sanctions screening."
        ),
        category="Enterprise Microservices",
        technologies=["Spring Boot 3", "Spring Cloud", "FastAPI", "LangGraph", "Groq Vision", "Kafka", "PostgreSQL", "React 19"],
        github_url="https://gitlab.com/dashboard/projects",
        demo_url=None,
        featured=True
    ),
    Project(
        id="aivision",
        title="AiVision - AI-Powered Maturity Assessment Platform",
        tagline="Full-stack AI assessment scoring across 5 organizational dimensions.",
        description=(
            "Provider-agnostic LLM scoring (OpenAI, Claude, Gemini, Groq) producing structured 1-3 audit scores "
            "with confidence levels, interactive Recharts dashboards, and automated PDF report synthesis."
        ),
        category="AI & Cloud Platforms",
        technologies=["Node.js", "Express", "FastAPI", "React", "TypeScript", "Prisma", "Supabase"],
        github_url="https://gitlab.com/dashboard/projects",
        demo_url=None,
        featured=True
    ),
    Project(
        id="labes-booking",
        title="Medical Appointment Booking Application",
        tagline="High-reliability MERN booking platform with sub-200ms response times.",
        description=(
            "Medical scheduling system featuring JWT authentication, responsive Tailwind UI, "
            "and optimized REST APIs delivering a 95% booking success rate."
        ),
        category="Full-Stack Web",
        technologies=["Node.js", "Express", "React", "JWT Auth", "Tailwind CSS", "MongoDB"],
        github_url="https://github.com/udali22/Labes_Solutions",
        demo_url=None,
        featured=True
    ),
    Project(
        id="louage-tunisie",
        title="Louage Tunisie - Intercity Shared-Taxi Platform",
        tagline="Real-time shared-taxi booking and transit coordinator.",
        description=(
            "Spring Boot backend with Spring Security, WebSocket trip tracking, and Angular/Ionic mobile "
            "application modeling trips, drivers, and bookings."
        ),
        category="Mobile & Distributed",
        technologies=["Spring Boot", "Spring Security", "Angular", "Ionic", "WebSockets", "MariaDB"],
        github_url="https://github.com/udali22/LouageTunisie",
        demo_url=None,
        featured=True
    )
]

PORTFOLIO_EDUCATION: List[EducationItem] = [
    EducationItem(
        degree="Engineering Degree in Software Engineering (MSc Equivalent)",
        institution="ISIMG Gabès",
        period="Sept. 2023 – Sept. 2026",
        honors="Graduated with Highest Honors (Mention Très Bien)",
        details="Yearly averages: 12.06 | 13.86 | 15.07 | 17.00 / 20"
    ),
    EducationItem(
        degree="Integrated Preparatory Cycle in Computer Science",
        institution="ISIMG Gabès",
        period="Sept. 2021 – Jun. 2023",
        honors="Graduated with Honors (Mention Bien)",
        details="Intensive foundations in mathematics, algorithmic analysis, physics, and software design."
    )
]

PORTFOLIO_CERTIFICATIONS: List[CertificationItem] = [
    CertificationItem(
        title="Model Context Protocol",
        issuer="Anthropic Academy",
        date="Mar. 2026"
    ),
    CertificationItem(
        title="Python for Data Science",
        issuer="IBM",
        date="Oct. 2024"
    )
]

PORTFOLIO_SKILLS: List[SkillGroup] = [
    SkillGroup(
        category="Backend & Microservices",
        description="Distributed systems, enterprise APIs, and asynchronous message brokers",
        skills=["Spring Boot 3", "Spring Cloud", "REST APIs", "FastAPI", "Node.js/Express", "Kafka", "WebSocket", ".NET 8 / EF Core"]
    ),
    SkillGroup(
        category="Programming Languages",
        description="Primary compiled and scripting languages for systems and pipelines",
        skills=["Java", "Python", "JavaScript / TypeScript", "C#"]
    ),
    SkillGroup(
        category="Databases & Storage",
        description="Relational and NoSQL persistent storage engines",
        skills=["PostgreSQL", "MySQL", "MongoDB", "MariaDB", "Microsoft SQL Server", "Prisma / Supabase"]
    ),
    SkillGroup(
        category="AI & Machine Learning",
        description="Production LLM orchestration, document OCR, speech AI, and NLP",
        skills=["LLM Integration (Groq Vision)", "LangGraph", "Transformers", "Whisper Fine-tuning", "PyAnnote", "RapidFuzz"]
    ),
    SkillGroup(
        category="Frontend & Mobile",
        description="Responsive web interfaces, state architecture, and mobile cross-platform",
        skills=["React 19 / TypeScript", "Angular", "ASP.NET Core MVC", "Tailwind CSS", "Ionic"]
    ),
    SkillGroup(
        category="DevOps & Methodologies",
        description="Containerization, automated pipelines, testing, and agile workflows",
        skills=["Docker", "Git", "GitHub Actions", "GitLab CI", "Agile / Scrum", "Unit Testing (xUnit)", "Postman"]
    )
]


# ==========================================
# API Routes
# ==========================================
@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {APP_NAME}",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    now = time.time()
    return HealthResponse(
        status="healthy",
        service="portfolio-backend",
        environment=ENVIRONMENT,
        uptime_seconds=round(now - START_TIME, 2),
        timestamp=now
    )


@app.get("/api/profile", response_model=ProfileData, tags=["Portfolio"])
def get_profile():
    return PORTFOLIO_PROFILE


@app.get("/api/experiences", response_model=List[Experience], tags=["Portfolio"])
def get_experiences():
    return PORTFOLIO_EXPERIENCES


@app.get("/api/projects", response_model=List[Project], tags=["Portfolio"])
def get_projects(category: Optional[str] = None):
    if category:
        return [p for p in PORTFOLIO_PROJECTS if p.category.lower() == category.lower()]
    return PORTFOLIO_PROJECTS


@app.get("/api/education", tags=["Portfolio"])
def get_education():
    return {
        "education": PORTFOLIO_EDUCATION,
        "certifications": PORTFOLIO_CERTIFICATIONS
    }


@app.get("/api/skills", response_model=List[SkillGroup], tags=["Portfolio"])
def get_skills():
    return PORTFOLIO_SKILLS


@app.post("/api/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED, tags=["Contact"])
def send_contact_message(msg: ContactMessage):
    return ContactResponse(
        success=True,
        message="Thank you! Your message has been received.",
        received_name=msg.name
    )
