# PDF Service PostgreSQL Migration TODO

## Plan:
Convert pdf/main.py & requirements.txt from MySQL to PostgreSQL (same DB: whatsapp_data)

**Files to Edit:**
- pdf/main.py: DATABASE_URL, pymysql → psycopg2
- pdf/requirements.txt: pymysql → psycopg2-binary

## Steps:
- [x] Step 1: Edit pdf/main.py
- [x] Step 2: Edit pdf/requirements.txt
- [ ] Step 3: Install deps
- [ ] Step 4: Test service
- [ ] Step 5: Complete
