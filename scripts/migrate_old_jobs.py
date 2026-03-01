#!/usr/bin/env python3
"""
Migration Script: Add Dynamic Weights to Existing Jobs

This script updates jobs created before the Two-Stage AI refactoring
by generating dynamic weights for them.

Usage:
    python scripts/migrate_old_jobs.py [--dry-run] [--job-id JOB_ID]

Options:
    --dry-run       Show what would be updated without making changes
    --job-id ID     Update only specific job by ID
    --all           Update all jobs without weights (default)
"""

import os
import sys
import argparse
import requests
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


def get_mongo_client():
    """Get MongoDB client from environment"""
    mongo_uri = os.getenv("MONGO_URI", "mongodb://root:root123456@localhost:27017/")
    client = MongoClient(mongo_uri)
    return client


def get_ai_engine_url():
    """Get analysis service URL from environment"""
    return os.getenv("ANALYSIS_SERVICE_URL", "http://localhost:7000")


def find_jobs_without_weights(db):
    """Find all jobs that don't have dynamic_weights field"""
    jobs_collection = db.job
    
    # Find jobs without dynamic_weights field
    jobs = list(jobs_collection.find({
        "dynamic_weights": {"$exists": False}
    }))
    
    return jobs


def regenerate_weights_for_job(job, ai_engine_url, dry_run=False):
    """
    Regenerate weights for a single job by calling analysis service
    """
    job_id = str(job["_id"])
    job_name = job.get("job_name", "Unknown")
    job_description = job.get("job_description", "")
    
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Processing job: {job_name} (ID: {job_id})")
    
    if dry_run:
        print(f"  Would call analysis service to generate weights")
        return None
    
    # Call analysis service
    try:
        print(f"  Calling analysis service...")
        response = requests.post(
            f"{ai_engine_url}/job/analyse",
            json={
                "job_name": job_name,
                "job_description": job_description
            },
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"  ❌ Error: Analysis service returned {response.status_code}")
            return None
        
        result = response.json()
        
        # Check if weights were generated
        if "dynamic_weights" not in result:
            print(f"  ⚠️  Warning: No weights in response (using fallback)")
            return None
        
        print(f"  ✅ Weights generated successfully")
        print(f"     Confidence: {result.get('weight_analysis', {}).get('confidence', 'N/A')}")
        print(f"     Weights: {result['dynamic_weights']}")
        
        return result
        
    except requests.exceptions.Timeout:
        print(f"  ❌ Error: Request timeout (job analysis took too long)")
        return None
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return None


def update_job_in_db(db, job_id, analysis_result, dry_run=False):
    """Update job in database with new weights"""
    if dry_run:
        print(f"  Would update job in database")
        return True
    
    try:
        jobs_collection = db.job
        
        # Prepare update data
        update_data = {
            "dynamic_weights": analysis_result["dynamic_weights"],
            "weight_analysis": analysis_result["weight_analysis"],
            "migrated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Update job
        result = jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 1:
            print(f"  ✅ Job updated in database")
            return True
        else:
            print(f"  ⚠️  Warning: Job not modified (may already be up to date)")
            return False
            
    except Exception as e:
        print(f"  ❌ Error updating database: {str(e)}")
        return False


def migrate_job(db, job, ai_engine_url, dry_run=False):
    """Migrate a single job"""
    # Generate weights
    analysis_result = regenerate_weights_for_job(job, ai_engine_url, dry_run)
    
    if analysis_result is None:
        return False
    
    # Update database
    success = update_job_in_db(db, str(job["_id"]), analysis_result, dry_run)
    
    return success


def main():
    parser = argparse.ArgumentParser(
        description="Migrate old jobs to include dynamic weights"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be updated without making changes"
    )
    parser.add_argument(
        "--job-id",
        type=str,
        help="Update only specific job by ID"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        default=True,
        help="Update all jobs without weights (default)"
    )
    
    args = parser.parse_args()
    
    print("=" * 80)
    print("Job Migration Script: Add Dynamic Weights to Existing Jobs")
    print("=" * 80)
    
    if args.dry_run:
        print("\n⚠️  DRY RUN MODE - No changes will be made\n")
    
    # Connect to MongoDB
    print("\n📊 Connecting to MongoDB...")
    try:
        client = get_mongo_client()
        db = client.get_database("talent_matcher")  # Adjust database name if needed
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        return 1
    
    # Get analysis service URL
    ai_engine_url = get_ai_engine_url()
    print(f"🔗 Analysis service URL: {ai_engine_url}")
    
    # Find jobs to migrate
    if args.job_id:
        print(f"\n🔍 Finding job with ID: {args.job_id}")
        try:
            job = db.job.find_one({"_id": ObjectId(args.job_id)})
            if job is None:
                print(f"❌ Job not found with ID: {args.job_id}")
                return 1
            
            if "dynamic_weights" in job:
                print(f"⚠️  Job already has dynamic weights")
                print(f"   Use --force to regenerate (not implemented yet)")
                return 0
            
            jobs_to_migrate = [job]
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return 1
    else:
        print("\n🔍 Finding jobs without dynamic weights...")
        jobs_to_migrate = find_jobs_without_weights(db)
    
    if len(jobs_to_migrate) == 0:
        print("✅ No jobs need migration - all jobs have dynamic weights!")
        return 0
    
    print(f"\n📋 Found {len(jobs_to_migrate)} job(s) to migrate:")
    for job in jobs_to_migrate:
        print(f"   - {job.get('job_name', 'Unknown')} (ID: {job['_id']})")
    
    # Confirm before proceeding
    if not args.dry_run:
        print(f"\n⚠️  This will update {len(jobs_to_migrate)} job(s) in the database")
        response = input("Continue? (yes/no): ")
        if response.lower() not in ['yes', 'y']:
            print("❌ Migration cancelled")
            return 0
    
    # Migrate jobs
    print("\n🚀 Starting migration...")
    success_count = 0
    fail_count = 0
    
    for i, job in enumerate(jobs_to_migrate, 1):
        print(f"\n[{i}/{len(jobs_to_migrate)}]", end=" ")
        
        success = migrate_job(db, job, ai_engine_url, args.dry_run)
        
        if success:
            success_count += 1
        else:
            fail_count += 1
    
    # Summary
    print("\n" + "=" * 80)
    print("Migration Summary")
    print("=" * 80)
    print(f"Total jobs: {len(jobs_to_migrate)}")
    print(f"✅ Successful: {success_count}")
    print(f"❌ Failed: {fail_count}")
    
    if args.dry_run:
        print("\n⚠️  This was a DRY RUN - no changes were made")
        print("   Run without --dry-run to apply changes")
    
    print("\n✨ Migration complete!")
    
    return 0 if fail_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
