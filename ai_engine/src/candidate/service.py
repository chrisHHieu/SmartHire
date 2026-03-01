import time
from datetime import datetime
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from config import settings
from src.candidate.prompts import system_prompt_candidate
from src.candidate.schemas import Resume
from src.candidate.file_extractor import FileExtractor
from src.utils import LOGGER


async def save_cv_candidate(file):
    # Prepend the current datetime to the filename
    file_name = datetime.now().strftime("%Y%m%d%H%M%S-") + file.filename

    # Construct the full image path based on the settings
    image_path = settings.CV_UPLOAD_DIR + file_name

    # Read the contents of the uploaded file asynchronously
    contents = await file.read()

    # Write the uploaded contents to the specified image path
    with open(image_path, "wb") as f:
        f.write(contents)

    return file_name


# Initialize FileExtractor instance (from main.py approach)
file_extractor = FileExtractor()


def read_cv_candidate(file_name):
    """
    Extract text + avatar from CV file using advanced FileExtractor with OCR capabilities.
    Returns dict with 'text' and 'avatar_base64' keys.
    """
    file_path = settings.CV_UPLOAD_DIR + file_name

    try:
        # Use advanced extraction with OCR + avatar support
        result = file_extractor.extract_and_clean_text(file_path)
        LOGGER.info(f"Successfully extracted text from {file_name}")
        return result
    except Exception as e:
        LOGGER.error(f"Error extracting text from {file_name}: {e}")
        raise ValueError(f"Failed to extract text from file: {file_name}")


def analyse_candidate(cv_content, avatar_base64=None):
    start = time.time()
    LOGGER.info("Start analyse candidate")

    # Use OpenAI GPT-4o-mini with Pydantic Structured Output
    llm = ChatOpenAI(
        model=settings.MODEL_NAME,
        openai_api_key=settings.OPENAI_API_KEY,
        temperature=0.1
    )
    structured_llm = llm.with_structured_output(Resume, method="function_calling")

    # Get current date and inject into system prompt using .format()
    current_date = datetime.now().strftime("%d/%m/%Y")
    system_prompt_with_date = system_prompt_candidate.format(current_date=current_date)
    
    # Create prompt template
    prompt_template = PromptTemplate(
        template=system_prompt_with_date + "\n\nResume Text:\n{resume_text}",
        input_variables=['resume_text']
    )

    prompt = prompt_template.invoke({'resume_text': cv_content})
    completion = structured_llm.invoke(prompt)

    # Convert Pydantic model to dict
    if hasattr(completion, 'model_dump'):
        json_output = completion.model_dump()  # type: ignore
    elif hasattr(completion, 'dict'):
        json_output = completion.dict()  # type: ignore
    else:
        # Fallback for dict response
        json_output = completion

    # Inject avatar_base64 (from file extractor, not from LLM)
    if avatar_base64:
        json_output["avatar_base64"] = avatar_base64

    LOGGER.info("Done analyse candidate")
    LOGGER.info(f"Time analyse candidate: {time.time() - start}")

    return json_output
