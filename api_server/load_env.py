"""
Load environment variables from .env file
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Print loaded variables for verification
print("🔧 Environment Variables Loaded:")
print(f"ANALYSIS_SERVICE_URL: {os.environ.get('ANALYSIS_SERVICE_URL')}")
print(f"MONGO_URL: {os.environ.get('MONGO_URL')}")
print(f"APP_NAME: {os.environ.get('APP_NAME')}")
print(f"SECRET_KEY: {'***' if os.environ.get('SECRET_KEY') else 'Not set'}")

# Verify analysis service connection
analysis_url = os.environ.get('ANALYSIS_SERVICE_URL')
if analysis_url:
    try:
        import requests
        response = requests.get(f"{analysis_url}/docs", timeout=5)
        if response.status_code == 200:
            print("Analysis Service connection successful")
        else:
            print(f"Analysis Service responded with status: {response.status_code}")
    except Exception as e:
        print(f"Cannot connect to Analysis Service: {e}")
        print("Make sure Analysis Service is running on the specified URL")
else:
    print("ANALYSIS_SERVICE_URL not set!")
