"""
Utility helpers for MongoDB document serialization.
"""

from bson import ObjectId


def serialize_doc(doc):
    """
    Recursively convert all ObjectId fields in a MongoDB document to strings.
    This ensures JSON serialization works correctly with FastAPI/Pydantic.
    """
    if doc is None:
        return None

    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]

    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result

    if isinstance(doc, ObjectId):
        return str(doc)

    return doc
