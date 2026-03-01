from marshmallow import Schema, fields


class UpdateCandidateSchema(Schema):
    candidate_name = fields.Str(required=True)
    phone_number = fields.Str(required=True)
    email = fields.Str(required=True)
    comment = fields.Str(required=True)


# Structured data schemas
class EducationSchema(Schema):
    school_name = fields.Str()
    degree = fields.Str(allow_none=True)
    field_of_study = fields.Str(allow_none=True)
    start_year = fields.Int(allow_none=True)
    end_year = fields.Int(allow_none=True)
    gpa = fields.Float(allow_none=True)


class WorkExperienceSchema(Schema):
    job_title = fields.Str()
    company_name = fields.Str()
    location = fields.Str(allow_none=True)
    start_date = fields.Str(allow_none=True)
    end_date = fields.Str(allow_none=True)
    responsibilities = fields.Str(allow_none=True)


class CertificationSchema(Schema):
    name = fields.Str()
    issuer = fields.Str(allow_none=True)
    issue_date = fields.Str(allow_none=True)
    expiration_date = fields.Str(allow_none=True)


class LanguageSchema(Schema):
    name = fields.Str()
    proficiency = fields.Str(allow_none=True)


class SkillSchema(Schema):
    name = fields.Str()
    level = fields.Str(allow_none=True)


class AwardSchema(Schema):
    title = fields.Str()
    description = fields.Str(allow_none=True)
    year = fields.Int(allow_none=True)


class CandidateSchema(Schema):
    _id = fields.Str(dump_only=True)
    candidate_name = fields.Str()
    phone_number = fields.Str()
    email = fields.Str()
    comment = fields.Str()

    # Legacy fields (for backward compatibility)
    certificate = fields.List(fields.Str())
    degree = fields.List(fields.Str())
    experience = fields.List(fields.Str())
    technical_skill = fields.List(fields.Str())
    responsibility = fields.List(fields.Str())
    soft_skill = fields.List(fields.Str())
    job_recommended = fields.List(fields.Str())

    # New structured fields
    full_name = fields.Str(allow_none=True)
    phone = fields.Str(allow_none=True)
    address = fields.Str(allow_none=True)
    summary = fields.Str(allow_none=True)
    date_of_birth = fields.Str(allow_none=True)
    structured_education = fields.List(fields.Nested(EducationSchema), allow_none=True)
    structured_experience = fields.List(fields.Nested(WorkExperienceSchema), allow_none=True)
    structured_skills = fields.List(fields.Nested(SkillSchema), allow_none=True)
    structured_certifications = fields.List(fields.Nested(CertificationSchema), allow_none=True)
    languages = fields.List(fields.Nested(LanguageSchema), allow_none=True)
    awards = fields.List(fields.Nested(AwardSchema), allow_none=True)

    cv_name = fields.Str()
    created_at = fields.Str()
    sql = fields.Int()
    office = fields.Int()


class CandidatePageSchema(Schema):
    results = fields.List(fields.Nested(CandidateSchema()))
    total_page = fields.Int()
    total_file = fields.Int()


class CandidateFilterSchema(Schema):
    page_size = fields.Int(allow_none=True, required=True)
    page = fields.Int(allow_none=True, required=True)


class ProcessedFileSchema(Schema):
    filename = fields.Str()
    candidate_id = fields.Str()
    candidate_name = fields.Str()


class UploadResponseSchema(Schema):
    success = fields.Bool()
    message = fields.Str()
    processed_files = fields.List(fields.Nested(ProcessedFileSchema()))
    total_processed = fields.Int()
