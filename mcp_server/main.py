from mcp.server.fastmcp import FastMCP
import os
import logging
from typing import List, Optional
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smarthire-mcp")

# Initialize FastMCP
mcp = FastMCP("SmartHire")

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://root:root123456@localhost:27017/db_local?authSource=admin")
client = MongoClient(MONGO_URL)
db = client.get_database()

def serialize_mongo(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

@mcp.tool()
def list_candidates_overview(page: int = 1, page_size: int = 10) -> str:
    """
    Get a high-level overview of candidates in the talent pool.
    Useful for discovering who is available before diving into details.
    """
    skip = (page - 1) * page_size
    candidates = list(db.candidate.find({}, {
        "candidate_name": 1, 
        "email": 1, 
        "technical_skill": 1, 
        "summary": 1
    }).skip(skip).limit(page_size))
    
    total = db.candidate.count_documents({})
    
    if not candidates:
        return "No candidates found in the database."
    
    output = [f"### Candidates Overview (Total: {total}, Page: {page})"]
    for c in candidates:
        skills = ", ".join(c.get("technical_skill", [])[:5])
        output.append(f"- **{c.get('candidate_name')}** ({c.get('email')})")
        output.append(f"  *Skills:* {skills}...")
        output.append(f"  *Summary:* {c.get('summary', 'No summary available')[:100]}...")
    
    return "\n".join(output)

@mcp.tool()
def search_candidates_by_criteria(skills: Optional[List[str]] = None, min_experience_years: Optional[int] = None, query: Optional[str] = None) -> str:
    """
    Search for candidates based on specific skills, experience, or keywords.
    Use this to find candidates that match specific job requirements.
    """
    filter_query = {}
    
    if skills:
        filter_query["technical_skill"] = {"$in": skills}
    
    if query:
        filter_query["$or"] = [
            {"candidate_name": {"$regex": query, "$options": "i"}},
            {"summary": {"$regex": query, "$options": "i"}},
            {"technical_skill": {"$regex": query, "$options": "i"}}
        ]
        
    candidates = list(db.candidate.find(filter_query).limit(10))
    
    if not candidates:
        return f"No candidates found matching criteria: skills={skills}, query='{query}'"
    
    output = [f"### Search Results ({len(candidates)} candidates found)"]
    for c in candidates:
        output.append(f"#### {c.get('candidate_name')} (ID: {c.get('_id')})")
        output.append(f"- **Email:** {c.get('email')}")
        output.append(f"- **Skills:** {', '.join(c.get('technical_skill', []))}")
        output.append(f"- **Experience Snippet:** {c.get('experience', ['N/A'])[0]}")
    
    return "\n".join(output)

@mcp.tool()
def get_candidate_full_profile(candidate_id: str) -> str:
    """
    Retrieve the complete profile and extracted data for a specific candidate.
    Use this when you need deep context to answer questions about a person's background.
    """
    try:
        candidate = db.candidate.find_one({"_id": ObjectId(candidate_id)})
    except:
        candidate = db.candidate.find_one({"id": candidate_id}) # Try string ID
        
    if not candidate:
        return f"Candidate with ID {candidate_id} not found."
    
    candidate = serialize_mongo(candidate)
    
    output = [f"# Candidate Profile: {candidate.get('candidate_name')}"]
    output.append(f"**Email:** {candidate.get('email')} | **Phone:** {candidate.get('phone_number')}")
    output.append(f"**Location:** {candidate.get('address', 'N/A')}")
    
    output.append("\n## Professional Summary")
    output.append(candidate.get('summary', 'No summary available.'))
    
    output.append("\n## Technical Skills")
    output.append(", ".join(candidate.get('technical_skill', [])))
    
    output.append("\n## Work Experience")
    for exp in candidate.get('experience', []):
        output.append(f"- {exp}")
        
    output.append("\n## Education")
    for edu in candidate.get('degree', []):
        output.append(f"- {edu}")
        
    output.append(f"\n--- \n*Source File:* {candidate.get('cv_name')} | *Created At:* {candidate.get('created_at')}")
    
    return "\n".join(output)

@mcp.tool()
def get_candidate_evaluation_history(candidate_id: str) -> str:
    """
    Get historical matching scores and AI analysis for a candidate across different jobs.
    Helps understand how this candidate performed in previous evaluations.
    """
    try:
        oid = ObjectId(candidate_id)
    except:
        return "Invalid candidate ID format."
        
    match_results = list(db.matching.find({"candidate_id": oid}))
    
    if not match_results:
        return "No evaluation history found for this candidate."
    
    output = [f"### Evaluation History (Total evaluations: {len(match_results)})"]
    for m in match_results:
        job = db.job.find_one({"_id": m.get("job_id")})
        job_name = job.get("job_name", "Unknown Job") if job else "Unknown Job"
        output.append(f"#### Job: {job_name}")
        output.append(f"- **Score:** {m.get('score')}/100")
        output.append(f"- **AI Summary:** {m.get('summary_comment')}")
        output.append("-" * 20)
        
    return "\n".join(output)

@mcp.tool()
def get_talent_pool_stats() -> str:
    """
    Get general statistics about the talent pool, such as top skills and total count.
    """
    total_candidates = db.candidate.count_documents({})
    total_jobs = db.job.count_documents({})
    
    # Simple skill aggregation (getting top 10 most common skills)
    pipeline = [
        {"$unwind": "$technical_skill"},
        {"$group": {"_id": "$technical_skill", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    top_skills = list(db.candidate.aggregate(pipeline))
    
    output = ["### SmartHire Talent Pool Statistics"]
    output.append(f"- **Total Candidates:** {total_candidates}")
    output.append(f"- **Total Jobs Open:** {total_jobs}")
    output.append("\n#### Top 10 Skills in Database:")
    for s in top_skills:
        output.append(f"- {s['_id']}: {s['count']} candidates")
        
    return "\n".join(output)

if __name__ == "__main__":
    mcp.run()
