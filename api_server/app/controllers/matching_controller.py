from app.schemas.matching_schema import (
    ProcessMatchingSchema,
    ProcessMatchingSelectiveSchema,
    MatchingSchema,
    MatchingFilterPageSchema,
    MatchingPageSchema,
    MatchingDetailSchema,
    MatchingResultSchema,
)
from app.services import matching_service
from flask.views import MethodView
from flask_smorest import Blueprint
from bson import ObjectId, errors

blp = Blueprint("Matching", __name__, description="Matching API")


@blp.route("/process-matching")
class Matching(MethodView):
    @blp.arguments(ProcessMatchingSchema)
    def post(self, matching_data):
        result = matching_service.process_matching(matching_data)
        return result


@blp.route("/process-matching-selective")
class MatchingSelective(MethodView):
    @blp.arguments(ProcessMatchingSelectiveSchema)
    @blp.response(200, MatchingResultSchema)
    def post(self, matching_data):
        """
        Process matching for specific candidates with a job
        Request: {"candidate_ids": ["id1", "id2"], "job_id": "job_id"}
        Returns matching results for each candidate
        """
        result = matching_service.process_matching_selective(matching_data)
        return result


@blp.route("/data-matching")
class MatchingFilter(MethodView):
    @blp.response(200, MatchingSchema(many=True))
    def get(self):
        result = matching_service.get_all_matching()
        return result

    @blp.arguments(MatchingFilterPageSchema)
    @blp.response(200, MatchingPageSchema)
    def post(self, matching_data):
        result = matching_service.filter_matching_data(matching_data)
        return result



@blp.route("/candidate/<string:candidate_id>/job/<string:job_id>")
class GetMatchingData(MethodView):
    @blp.response(200, MatchingDetailSchema)
    def get(self, candidate_id, job_id):
        # Validate ObjectId
        try:
            candidate_oid = ObjectId(candidate_id)
            job_oid = ObjectId(job_id)
        except errors.InvalidId:
            return {"error": "Invalid candidate_id or job_id"}, 400

        result = matching_service.get_matching_data(candidate_oid, job_oid)
        return result
