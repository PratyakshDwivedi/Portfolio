/**
 * ─────────────────────────────────────────────────────────────
 * TECHNICAL PROJECTS
 * GitHub URLs are EXACT as supplied, do not "correct" them.
 * ─────────────────────────────────────────────────────────────
 */
export interface Project {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  /** One-line gist shown on the folder card before it is opened. */
  gist: string;
  stack: string[];
  description: string[];
  achievements: string[];
  github: string;
  accent: string;
  /** Bullet points for the "Reason & Motivation" file card. */
  reason?: string[];
  /** Bullet points for the "Impact & Advantage" file card. */
  impact?: string[];
  /** Pipeline/architecture image for the "Pipeline View" file card. */
  pipelineImage?: string;
}

export const projects: Project[] = [
  {
    id: "carboncut",
    index: "01",
    title: "CarbonCut: AST-Based Sustainable ML Data Pipeline Middleware",
    shortTitle: "CarbonCut",
    gist: "AST-based sustainable ML data pipeline middleware with performance and energy telemetry.",
    stack: [
      "Python",
      "AST Manipulation",
      "Data Pipelines",
      "Keras 3",
      "Performance Analytics",
    ],
    description: [
      "Engineered an automated compilation refactoring middleware engine via Abstract Syntax Tree (AST) manipulation to inject sustainability and performance monitoring hooks into data processing lifecycles.",
      "Programmed custom telemetry passes to profile real-time compute and energy usage, eliminating redundant execution cycles and improving data pipeline resource utilization.",
      "Led technical decision-making by evaluating energy metrics and system throughput, mapping engineering KPIs directly to scalable green-tech standard solutions.",
    ],
    achievements: [
      "AST-driven code refactoring middleware",
      "Real-time compute & energy telemetry passes",
      "Green-tech KPI mapping for ML pipelines",
    ],
    // ⚠️ EXACT URL, supplied as-is. Do not change.
    github: "https://github.com/PratyakshDwivedi/sre-job-system",
    accent: "#FFCC1D",
    reason: [
      "The hidden carbon cost: standard deep learning training defaults to 32 bit floating point math and unconstrained training loops, consuming electricity and generating hidden carbon emissions without developer awareness.",
      "Passive tools vs active optimization: existing carbon tracking software acts mainly as passive monitoring, forcing developers to manually rewrite code to save energy. CarbonCut OS was built to bridge this gap through active automated optimization.",
      "Automated compiler middleware: built using Abstract Syntax Tree static analysis and real time hardware profiling, the system treats energy efficiency as a primary compilation objective without altering core model logic.",
      "Zero touch developer experience: the goal was to make Green AI easier by handling low level code refactoring behind the scenes and minimizing manual code changes.",
    ],
    impact: [
      "50% reduction in GPU power draw: by automatically shifting memory bound matrix operations from FP32 to FP16 at the AST layer, the engine cuts VRAM memory bandwidth pressure and reduces active GPU wattage by up to half on local hardware.",
      "Dynamic loop pruning: the EROI Governor evaluates accuracy gains against carbon costs and can terminate training loops when returns plateau, reducing unnecessary compute.",
      "Faster training and lower thermal stress: optimizing code execution before runtime can improve training efficiency while reducing heat and hardware strain on local GPUs.",
      "Automated ESG compliance: the platform streams GPU telemetry to a local Docker dashboard and generates downloadable environmental impact reports for academic and industry auditing.",
    ],
    pipelineImage: "/assets/images/pipelines/carboncut.jpg",
  },
  {
    id: "distributed-jobs",
    index: "02",
    title: "Cloud-Native Distributed Job Processing System",
    shortTitle: "Distributed Job System",
    gist: "Cloud-native distributed job processing with asynchronous workloads and real-time observability.",
    stack: [
      "Java",
      "Python",
      "FastAPI",
      "Redis",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Grafana",
      "Microservices",
    ],
    description: [
      "Designed and deployed scalable, high-throughput REST APIs and cloud-native microservices architecture to process asynchronous concurrent backend workloads reliably.",
      "Constructed real-time monitoring dashboards using Prometheus and Grafana to track infrastructure health, operational metrics, and high-volume user load analytics.",
    ],
    achievements: [
      "High-throughput async job processing",
      "Kubernetes-orchestrated microservices",
      "Prometheus + Grafana observability stack",
    ],
    // ⚠️ EXACT URL, supplied as-is. Do not change.
    github: "https://github.com/PratyakshDwivedi/CarbonCut2.0",
    accent: "#7A94B8",
    reason: [
      "To solve a real world problem: I built this project to create a reliable job processing system where users can submit multiple jobs and have them processed efficiently in the background without making the application slow or unresponsive.",
      "To understand distributed systems: the project helped me understand how different services such as the API, Redis queue, workers, and database can work independently while communicating with each other to complete a job.",
      "To implement asynchronous processing: I used Redis as a queue between the API and workers so that jobs can be submitted quickly and processed asynchronously, allowing the system to handle multiple requests more efficiently.",
      "To apply SRE principles: I wanted to go beyond simply developing an application and understand how reliability can be measured using monitoring, SLOs, error budgets, RTO, and RPO.",
      "To learn failure handling: I intentionally introduced failures and tested the system under different conditions to understand how a distributed application behaves when one of its important components becomes unavailable.",
    ],
    impact: [
      "Improves system reliability: the architecture separates important services so that a problem in one component does not necessarily bring down the entire application, making the overall system more resilient.",
      "Provides complete observability: Prometheus and Grafana allow me to monitor important application and database metrics, making it easier to identify performance problems, failures, and changes in system behavior.",
      "Supports scalability: the worker based architecture allows multiple workers to process jobs simultaneously, while Kubernetes can be used to manage and scale these services according to workload.",
      "Makes reliability measurable: instead of simply saying that the system is reliable, I can evaluate it using measurable SLOs, error budgets, Recovery Time Objective, and Recovery Point Objective.",
      "Provides production oriented experience: the project combines Docker, Kubernetes, FastAPI, Redis, PostgreSQL, Prometheus, and Grafana to demonstrate how modern cloud native systems are developed, monitored, tested, and operated.",
    ],
    pipelineImage: "/assets/images/pipelines/distributed-jobs.jpg",
  },
  {
    id: "music-recommendation",
    index: "03",
    title: "Music Recommendation System using Sentiment Analysis",
    shortTitle: "Music Recommendation System",
    gist: "Sentiment-driven music recommendations using NLP, mood classification and audio-feature clustering.",
    stack: [
      "Python",
      "Machine Learning",
      "NLP",
      "Logistic Regression",
      "K-Means",
      "Spotify Web API",
    ],
    description: [
      "Built a sentiment-based music recommendation system in Python, applying NLP preprocessing (tokenization, stopword removal, TF-IDF vectorization) to infer emotion from user text.",
      "Trained a Logistic Regression classifier for mood detection and applied K-Means clustering to categorize 1,000+ tracks by audio features and mood, integrating the Spotify Web API for real-time recommendations.",
    ],
    achievements: [
      "NLP pipeline: tokenization, stopword removal, TF-IDF",
      "Logistic Regression classifier for mood detection",
      "K-Means clustering across 1,000+ tracks",
      "Spotify Web API for real-time recommendations",
    ],
    // ⚠️ EXACT URL, supplied as-is. Do not change.
    github: "https://github.com/PratyakshDwivedi/MRS",
    accent: "#FFD94A",
    reason: [
      "Traditional music platforms often recommend songs using genres or listening history, which can miss the user's current mood.",
      "Music is deeply emotional, yet standard recommendation systems do not directly process natural human language to understand how someone feels in real time.",
      "This project uses NLP techniques including tokenization, stopword removal, and TF IDF vectorization to convert user input into meaningful data.",
      "A supervised Logistic Regression classifier predicts emotional state, while unsupervised K Means clustering categorizes song audio features and works with the Spotify Web API to provide mood based recommendations.",
    ],
    impact: [
      "It transforms music discovery into a conversational experience where users can describe their thoughts and receive personalized song recommendations.",
      "Combining sentiment classification with audio feature clustering connects human emotion with measurable audio characteristics.",
      "Mapping sentiment information to track clusters helps reduce recommendation latency while supporting mood based recommendations across more than 1,000 songs.",
      "Real time API retrieval provides a scalable architecture for dynamic playlist generation.",
    ],
    pipelineImage: "/assets/images/pipelines/music-recommendation.jpg",
  },
];
