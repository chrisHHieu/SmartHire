from marshmallow import Schema, fields


class ProcessMatchingSchema(Schema):
    job_name = fields.Str(required=True)


class ProcessMatchingSelectiveSchema(Schema):
    candidate_ids = fields.List(fields.Str(), required=True)
    job_id = fields.Str(required=True)


class AnalyseSchema(Schema):
    comment = fields.Str(allow_none=True)
    score = fields.Int(allow_none=True)


class MatchingSchema(Schema):
    _id = fields.Str()
    candidate_id = fields.Str()
    job_id = fields.Str()
    degree = fields.Nested(AnalyseSchema())
    experience = fields.Nested(AnalyseSchema())
    responsibility = fields.Nested(AnalyseSchema())
    soft_skill = fields.Nested(AnalyseSchema())
    technical_skill = fields.Nested(AnalyseSchema())
    certificate = fields.Nested(AnalyseSchema())
    summary_comment = fields.Str()
    score = fields.Float()


class MatchingFilterPageSchema(Schema):
    job_name = fields.Str(required=True)
    page_size = fields.Int(allow_none=True, required=True)
    page = fields.Int(allow_none=True, required=True)


class PlainMatchingSchema(Schema):
    id = fields.Str(dump_only=True)
    candidate_name = fields.Str(required=True)
    candidate_email = fields.Str(required=True)
    candidate_email = fields.Str(required=True)
    cv_name = fields.Str(required=True)
    score = fields.Str(required=True)
    summary_comment = fields.Str(required=True)
    matching_status = fields.Bool(required=True)


class MatchingPageSchema(Schema):
    results = fields.List(fields.Nested(PlainMatchingSchema()))
    total_page = fields.Int()
    total_matching = fields.Int()


class WeightAnalysisSchema(Schema):
    dynamic_weights = fields.Dict()
    ai_confidence = fields.Float()
    job_analysis = fields.Dict()
    weight_reasoning = fields.Dict()


class CandidateMatchingResultSchema(Schema):
    candidate_id = fields.Str(required=True)
    candidate_name = fields.Str(required=True)
    email = fields.Str(allow_none=True)
    phone_number = fields.Str(allow_none=True)
    cv_name = fields.Str(allow_none=True)
    score = fields.Float(required=True)
    summary_comment = fields.Str(required=True)
    degree = fields.Nested(AnalyseSchema(), allow_none=True)
    experience = fields.Nested(AnalyseSchema(), allow_none=True)
    responsibility = fields.Nested(AnalyseSchema(), allow_none=True)
    soft_skill = fields.Nested(AnalyseSchema(), allow_none=True)
    technical_skill = fields.Nested(AnalyseSchema(), allow_none=True)
    certificate = fields.Nested(AnalyseSchema(), allow_none=True)
    language = fields.Nested(AnalyseSchema(), allow_none=True)
    weight_analysis = fields.Nested(WeightAnalysisSchema(), allow_none=True)


class MatchingResultSchema(Schema):
    success = fields.Bool(required=True)
    job_id = fields.Str(required=True)
    job_name = fields.Str(required=True)
    total_matched = fields.Int(required=True)
    results = fields.List(fields.Nested(CandidateMatchingResultSchema()))


class MatchingDetailSchema(Schema):
    _id = fields.Str()
    candidate_name = fields.Str(allow_none=True)
    phone_number = fields.Str(allow_none=True)
    email = fields.Str(allow_none=True)
    cv_name = fields.Str(allow_none=True)
    job_recommended = fields.List(fields.Str(), allow_none=True)
    job_name = fields.Str(allow_none=True)
    score = fields.Float(allow_none=True)
    summary_comment = fields.Str(allow_none=True)
    degree = fields.Nested(AnalyseSchema(), allow_none=True)
    experience = fields.Nested(AnalyseSchema(), allow_none=True)
    responsibility = fields.Nested(AnalyseSchema(), allow_none=True)
    soft_skill = fields.Nested(AnalyseSchema(), allow_none=True)
    technical_skill = fields.Nested(AnalyseSchema(), allow_none=True)
    certificate = fields.Nested(AnalyseSchema(), allow_none=True)
    language = fields.Nested(AnalyseSchema(), allow_none=True)
    weight_analysis = fields.Nested(WeightAnalysisSchema(), allow_none=True)
