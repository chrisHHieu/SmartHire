"""
Advanced resume file extractor using LandingAI ADE SDK.
Supports: PDF, DOCX
Logic:
1. PDF -> LandingAI ADE (converts to structured markdown)
2. DOCX -> Simple text extraction
"""

import os
from pathlib import Path
import docx2txt
from landingai_ade import LandingAIADE

from src.utils import LOGGER
from config import settings


# ==========================
# 🔹 File Extractor
# ==========================
class FileExtractor:
    def __init__(self):
        """Initialize the extractor with LandingAI ADE client."""
        self.ade_enabled = False
        self.ade_client = None
        
        # Try to initialize LandingAI ADE client
        if settings.LANDINGAI_API_KEY:
            try:
                self.ade_client = LandingAIADE(apikey=settings.LANDINGAI_API_KEY)
                self.ade_enabled = True
                LOGGER.info("LandingAI ADE SDK has been successfully enabled.")
            except Exception as e:
                LOGGER.warning(
                    f"Failed to initialize LandingAI ADE client: {e}. Falling back to basic extraction."
                )
        else:
            LOGGER.warning("No LandingAI API key provided. Using basic text extraction.")

    def _extract_from_pdf_with_ade(self, pdf_path: str) -> str:
        """Extract text from PDF using LandingAI ADE SDK (converts to markdown)."""
        if not self.ade_enabled or not self.ade_client:
            LOGGER.error("LandingAI ADE is not enabled. Cannot extract PDF.")
            return ""

        try:
            LOGGER.info(f"Processing PDF with LandingAI ADE: {pdf_path}")
            
            # Parse document with LandingAI ADE
            parse_response = self.ade_client.parse(
                document=Path(pdf_path),
                model="dpt-1",  # Document parsing model
            )
            
            # Combine all chunks into markdown text
            markdown_parts = []
            for i, chunk in enumerate(parse_response.chunks, 1):
                # Add section header based on chunk type
                markdown_parts.append(f"### {chunk.type.capitalize()}")
                markdown_parts.append(chunk.markdown)
                markdown_parts.append("")  # Empty line for separation
            
            full_text = "\n".join(markdown_parts)
            
            LOGGER.info(f"Successfully extracted {len(full_text)} chars from PDF using LandingAI ADE")
            return full_text
            
        except Exception as e:
            LOGGER.error(f"Error extracting PDF with LandingAI ADE: {e}")
            return ""

    def _extract_from_docx(self, docx_path: str) -> str:
        """Extract text from DOCX (simple text extraction only)."""
        try:
            text = docx2txt.process(docx_path)
            LOGGER.info(f"Successfully extracted {len(text)} chars from DOCX")
            return text.strip()
        except Exception as e:
            LOGGER.error(f"Error extracting text from DOCX: {e}")
            return ""

    def extract_text(self, file_path: str) -> str:
        """Detect format and extract raw text."""
        ext = Path(file_path).suffix.lower()
        if ext == ".pdf":
            return self._extract_from_pdf_with_ade(file_path)
        elif ext == ".docx":
            return self._extract_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    def extract_and_clean_text(self, file_path: str) -> str:
        """Extract text from resume (no cleaning needed - markdown is already structured)."""
        text = self.extract_text(file_path)

        LOGGER.info(f"Extracted {len(text)} chars from {file_path}")
        
        # Debug logging
        if os.getenv("DEBUG", "").lower() == "true":
            print("=== EXTRACTED TEXT ===")
            print(text)
        
        return text
