# Analysis Service

AI-powered resume analysis service using Google Gemini with Pydantic structured output.

## Features

- **ATS-Compatible Parsing**: Professional resume parsing following industry standards
- **Google Gemini AI**: Advanced language model for accurate text extraction
- **Structured Output**: Type-safe Pydantic models for consistent data format
- **Advanced File Processing**: OCR-enabled extraction for scanned documents
- **Multi-format Support**: PDF and DOCX file processing with image extraction
- **OCR Capabilities**: Support for scanned PDFs and embedded images
- **Multilingual Support**: English and Vietnamese text recognition
- **Professional Schema**: Nested objects for education, experience, skills, etc.
- **Hybrid Analysis**: Data extraction + AI-powered analysis and job recommendations

## Development Environment

### Prerequisites

- **Tesseract OCR**: Required for text recognition from images
  - Windows: Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)
  - macOS: `brew install tesseract`
  - Ubuntu: `sudo apt install tesseract-ocr tesseract-ocr-vie`

1. **Create Environment and Install Packages**

   ```shell
   conda create -n ai_engine python=3.10
   ```

   ```shell
   conda activate ai_engine
   ```

   ```shell
   pip install -r requirements.txt
   ```

2. **Environment Configuration**

   ```shell
   cp .env.example .env
   # Edit .env and add your GOOGLE_API_KEY
   ```

3. **Test File Extraction**

   ```shell
   python test_file_extraction.py
   ```

4. **Run the Application**

   ```shell
   uvicorn app:app --port 7000
   ```

## API Endpoints

- `POST /candidate/analyse` - Upload and analyze CV files
- `GET /healthz` - Health check

## Configuration

Key environment variables:
- `GOOGLE_API_KEY` - Google Gemini API key (required)
- `MODEL_NAME` - Gemini model name (default: gemini-2.0-flash)
- `CV_UPLOAD_DIR` - Directory for uploaded files (default: ./candidate_cv/)
