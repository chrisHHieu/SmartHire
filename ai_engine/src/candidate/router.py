from fastapi import APIRouter, File, UploadFile, HTTPException
from src.candidate import service
from src.candidate.schemas import Resume

router = APIRouter()


@router.post("/analyse", response_model=Resume)
async def analyse_candidate(file: UploadFile = File(...)):
    """
    Analyze candidate CV and extract structured information.

    Supports PDF and DOCX files with OCR capabilities.
    Returns ATS-compatible structured data.
    """
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )

    file_name = await service.save_cv_candidate(file=file)
    cv_content = service.read_cv_candidate(file_name=file_name)
    result = service.analyse_candidate(cv_content=cv_content)

    return result
