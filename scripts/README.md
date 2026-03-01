# Scripts - Two-Stage AI Refactoring

This folder contains utility scripts for the Two-Stage AI refactoring.

## Available Scripts

### 1. test_refactoring.py

**Purpose:** Test the refactored Two-Stage AI implementation

**Usage:**
```bash
# Test with default URLs (localhost)
python scripts/test_refactoring.py

# Test with custom URLs
python scripts/test_refactoring.py \
  --analysis-url http://localhost:7000 \
  --api_server-url http://localhost:5000
```

**What it tests:**
- ✅ Job creation includes dynamic weights
- ✅ Matching uses pre-computed weights
- ✅ Performance improvements realized
- ✅ Backward compatibility maintained

**Expected output:**
```
Test 1: Job Creation with Two-Stage AI
✅ Job requirements extracted successfully
✅ Dynamic weights generated successfully
✅ Weights sum to 1.0
✅ Weight analysis included
✅ AI confidence: 85%
✅ Test 1 PASSED

Test 2: Matching with Pre-computed Weights
✅ All required fields present
✅ Pre-computed weights used in matching
✅ Final weighted score: 78.50/100
✅ Matching completed in 4.2s (target: <8s)
✅ Test 2 PASSED

Test 3: Performance Comparison
✅ Performance test completed

Test 4: Backward Compatibility
✅ Matching works with old job format
✅ Test 4 PASSED

Results: 4/4 tests passed
✅ All tests passed! ✨
```

---

### 2. migrate_old_jobs.py

**Purpose:** Add dynamic weights to jobs created before refactoring

**Usage:**
```bash
# Dry run (see what would be updated)
python scripts/migrate_old_jobs.py --dry-run

# Migrate all jobs without weights
python scripts/migrate_old_jobs.py --all

# Migrate specific job by ID
python scripts/migrate_old_jobs.py --job-id 507f1f77bcf86cd799439011
```

**What it does:**
1. Finds jobs without `dynamic_weights` field
2. Calls analysis service to generate weights
3. Updates jobs in MongoDB with new weights
4. Logs progress and results

**Expected output:**
```
Job Migration Script: Add Dynamic Weights to Existing Jobs
================================================================================

📊 Connecting to MongoDB...
✅ Connected to MongoDB
🔗 Analysis service URL: http://localhost:7000

🔍 Finding jobs without dynamic weights...
📋 Found 5 job(s) to migrate:
   - Senior Backend Engineer (ID: 507f1f77bcf86cd799439011)
   - Frontend Developer (ID: 507f1f77bcf86cd799439012)
   - Data Scientist (ID: 507f1f77bcf86cd799439013)
   - DevOps Engineer (ID: 507f1f77bcf86cd799439014)
   - Product Manager (ID: 507f1f77bcf86cd799439015)

⚠️  This will update 5 job(s) in the database
Continue? (yes/no): yes

🚀 Starting migration...

[1/5] Processing job: Senior Backend Engineer (ID: 507f1f77bcf86cd799439011)
  Calling analysis service...
  ✅ Weights generated successfully
     Confidence: 0.85
     Weights: {'degree': 0.15, 'experience': 0.30, ...}
  ✅ Job updated in database

[2/5] Processing job: Frontend Developer (ID: 507f1f77bcf86cd799439012)
  ...

================================================================================
Migration Summary
================================================================================
Total jobs: 5
✅ Successful: 5
❌ Failed: 0

✨ Migration complete!
```

---

## Prerequisites

### Python Dependencies

```bash
pip install requests pymongo
```

### Environment Variables

Set these before running scripts:

```bash
# MongoDB connection
export MONGO_URI="mongodb://root:root123456@localhost:27017/"

# Analysis service URL
export ANALYSIS_SERVICE_URL="http://localhost:7000"
```

Or create a `.env` file:
```
MONGO_URI=mongodb://root:root123456@localhost:27017/
ANALYSIS_SERVICE_URL=http://localhost:7000
```

---

## Common Issues

### Issue: Connection refused

**Cause:** Services not running

**Solution:**
```bash
# Start services with docker-compose
docker-compose up -d

# Or start individually
cd ai_engine && uvicorn app:app --port 7000
cd api_server && flask run --port 5000
```

### Issue: Timeout errors

**Cause:** Job analysis takes too long (>60s)

**Solution:**
- Check OpenAI API key is set
- Verify network connection
- Increase timeout in script if needed

### Issue: MongoDB connection failed

**Cause:** Wrong connection string or MongoDB not running

**Solution:**
```bash
# Check MongoDB is running
docker ps | grep mongo

# Verify connection string
echo $MONGO_URI

# Test connection
python -c "from pymongo import MongoClient; client = MongoClient('$MONGO_URI'); print('Connected!')"
```

---

## Development

### Adding New Tests

To add a new test to `test_refactoring.py`:

```python
def test_my_new_feature(analysis_url):
    """Test 5: My new feature"""
    print_header("Test 5: My New Feature")
    
    # Your test logic here
    
    if success:
        print_success("Test 5 PASSED")
        return True
    else:
        print_error("Test 5 FAILED")
        return False

# Add to main():
success = test_my_new_feature(args.analysis_url)
results.append(("My New Feature", success))
```

### Adding New Migration Options

To add options to `migrate_old_jobs.py`:

```python
parser.add_argument(
    "--my-option",
    action="store_true",
    help="Description of my option"
)

# Use in main():
if args.my_option:
    # Your logic here
    pass
```

---

## Best Practices

### Before Running Scripts

1. **Backup database**
   ```bash
   mongodump --uri="$MONGO_URI" --out=backup/
   ```

2. **Test in staging first**
   ```bash
   export MONGO_URI="mongodb://staging-db:27017/"
   python scripts/migrate_old_jobs.py --dry-run
   ```

3. **Run dry-run**
   ```bash
   python scripts/migrate_old_jobs.py --dry-run
   ```

### After Running Scripts

1. **Verify results**
   ```bash
   python scripts/test_refactoring.py
   ```

2. **Check logs**
   ```bash
   tail -f ai_engine/logs/api.log
   tail -f api_server/logs/api.log
   ```

3. **Monitor performance**
   - Check matching speed
   - Verify API costs
   - Review error rates

---

## Troubleshooting

### Enable Debug Logging

```python
# Add to top of script
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Script Permissions

```bash
chmod +x scripts/*.py
```

### Verify Python Version

```bash
python --version  # Should be 3.8+
```

---

## Support

For issues or questions:
- Check logs: `ai_engine/logs/api.log`
- Review documentation: `REFACTORING_NOTES.md`
- Contact engineering team

---

**Last Updated:** 2024-02-24  
**Maintainer:** Engineering Team
