# ai_engine - AI & OCR Analysis Service

`ai_engine` is the analytical core of the SmartHire system, responsible for deep CV parsing and intelligent matching logic using Large Language Models (LLMs).

## 🌟 Core Functionalities

-   **Smart Parsing**: Extracting structured markdown and avatars from PDF files using **LandingAI ADE SDK**.
-   **Docx Extraction**: Fast text extraction from Word documents using **docx2txt**.
-   **Avatar Detection**: Automatically identifying and cropping candidate photos using **PyMuPDF**.
-   **Structured Extraction**: Identifying key entities like Name, Email, Skills, and Experience from unstructured text via LLMs.
-   **Matching Logic**: Calculating multi-dimensional compatibility scores based on job requirements.

## 🔄 Logic Workflow

```mermaid
sequenceDiagram
    participant API as api_server
    participant AI as ai_engine
    participant OCR as OCR / Parser
    participant LLM as LLM (OpenAI/Gemini)

    API->>AI: POST /candidate/analyse (File)
    AI->>OCR: Extract raw content
    OCR-->>AI: Raw Text
    AI->>LLM: Prompt with Instruction + Text
    LLM-->>AI: Structured JSON Data
    AI-->>API: Return Candidate Schema
    
    Note over API,LLM: Matching Workflow
    API->>AI: POST /matching/analyse (Job + Candidate)
    AI->>LLM: Compare Job Requirements with Candidate Profile
    LLM-->>AI: Scores, Reasoning, Success/Risk Factors
    AI-->>API: Resulting Match Object
```

## 🛠️ Tech Stack

-   **Runtime**: Python 3.11
-   **Framework**: FastAPI
-   **Package Manager**: `uv` (Production standard)
-   **Main Libraries**: LangChain, Pydantic, PyMuPDF, LandingAI ADE.

## 🚀 Running the Service

### via Docker
```bash
docker compose up -d --build ai_engine
```

### Manual Run
1.  **Install dependencies**: `uv sync`
2.  **Environment**: Fill `.env` with required API keys.
3.  **Run**: `uv run uvicorn app:app --port 7000 --reload`
