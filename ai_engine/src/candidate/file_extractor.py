"""
Advanced resume file extractor using LandingAI ADE SDK.
Supports: PDF, DOCX
Logic:
1. PDF -> LandingAI ADE (converts to structured markdown + avatar extraction)
2. DOCX -> Simple text extraction (no avatar support)
"""

import os
import base64
from pathlib import Path
from io import BytesIO
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

    def _extract_from_pdf_with_ade(self, pdf_path: str) -> dict:
        """Extract text + avatar from PDF using LandingAI ADE SDK.
        
        Returns:
            dict with keys:
                - text: str (markdown content)
                - avatar_base64: str | None (base64 encoded PNG of first figure)
        """
        if not self.ade_enabled or not self.ade_client:
            LOGGER.error("LandingAI ADE is not enabled. Cannot extract PDF.")
            return {"text": "", "avatar_base64": None}

        try:
            LOGGER.info(f"Processing PDF with LandingAI ADE: {pdf_path}")

            # Parse document with LandingAI ADE (ONE call for both text + figures)
            parse_response = self.ade_client.parse(
                document=Path(pdf_path),
                model="dpt-2",
            )

            # === Extract text from all chunks ===
            markdown_parts = []
            for i, chunk in enumerate(parse_response.chunks, 1):
                markdown_parts.append(f"### {chunk.type.capitalize()}")
                markdown_parts.append(chunk.markdown)
                markdown_parts.append("")

            full_text = "\n".join(markdown_parts)
            LOGGER.info(f"Successfully extracted {len(full_text)} chars from PDF using LandingAI ADE")

            # === Extract avatar from first figure chunk ===
            avatar_base64 = self._crop_avatar_from_chunks(parse_response.chunks, pdf_path)

            return {"text": full_text, "avatar_base64": avatar_base64}

        except Exception as e:
            LOGGER.error(f"Error extracting PDF with LandingAI ADE: {e}")
            return {"text": "", "avatar_base64": None}

    def _crop_avatar_from_chunks(self, chunks, pdf_path: str) -> str | None:
        """Find first figure chunk and crop it from the PDF as avatar.
        
        Returns:
            base64 encoded PNG string, or None if no figure found.
        """
        try:
            import fitz  # PyMuPDF
        except ImportError:
            LOGGER.warning("PyMuPDF not installed. Cannot crop avatar. Run: pip install pymupdf")
            return None

        # Find first figure chunk
        figure_chunk = None
        for chunk in chunks:
            if chunk.type == "figure":
                figure_chunk = chunk
                break

        if figure_chunk is None:
            LOGGER.info("No figure found in PDF — skipping avatar extraction.")
            return None

        try:
            grounding = figure_chunk.grounding
            box = grounding.box
            page_num = grounding.page

            # Open PDF with PyMuPDF
            doc = fitz.open(pdf_path)
            page = doc[page_num]
            rect = page.rect

            # Convert normalized coordinates (0-1) to page points
            left = box.left * rect.width
            top = box.top * rect.height
            right = box.right * rect.width
            bottom = box.bottom * rect.height

            clip_rect = fitz.Rect(left, top, right, bottom)

            # Crop at 300 DPI with alpha channel
            pix = page.get_pixmap(dpi=300, clip=clip_rect, alpha=True)
            doc.close()

            # Convert to base64
            img_bytes = pix.tobytes("png")
            avatar_b64 = base64.b64encode(img_bytes).decode("utf-8")

            LOGGER.info(
                f"Successfully cropped avatar from page {page_num}, "
                f"size: {pix.width}x{pix.height}, "
                f"base64 length: {len(avatar_b64)}"
            )
            return avatar_b64

        except Exception as e:
            LOGGER.error(f"Error cropping avatar from PDF: {e}")
            return None

    def _extract_from_docx(self, docx_path: str) -> dict:
        """Extract text from DOCX (no avatar support).
        
        Returns:
            dict with keys: text, avatar_base64
        """
        try:
            text = docx2txt.process(docx_path)
            LOGGER.info(f"Successfully extracted {len(text)} chars from DOCX")
            return {"text": text.strip(), "avatar_base64": None}
        except Exception as e:
            LOGGER.error(f"Error extracting text from DOCX: {e}")
            return {"text": "", "avatar_base64": None}

    def extract(self, file_path: str) -> dict:
        """Detect format and extract text + avatar.
        
        Returns:
            dict with keys:
                - text: str
                - avatar_base64: str | None
        """
        ext = Path(file_path).suffix.lower()
        if ext == ".pdf":
            return self._extract_from_pdf_with_ade(file_path)
        elif ext == ".docx":
            return self._extract_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    def extract_and_clean_text(self, file_path: str) -> dict:
        """Extract text + avatar from resume.
        
        Returns:
            dict with keys:
                - text: str
                - avatar_base64: str | None
        """
        result = self.extract(file_path)

        LOGGER.info(f"Extracted {len(result['text'])} chars from {file_path}")
        if result["avatar_base64"]:
            LOGGER.info("Avatar detected and extracted successfully.")
        else:
            LOGGER.info("No avatar found in document.")

        # Debug logging
        if os.getenv("DEBUG", "").lower() == "true":
            print("=== EXTRACTED TEXT ===")
            print(result["text"])

        return result
