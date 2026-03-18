import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
client = create_client(url, key)

response = client.table("sections").select("id", count="exact").execute()
print(f"Total sections in DB: {response.count}")

response = client.table("sections").select("id, title_en").limit(10).execute()
print("Sample sections:")
for s in response.data:
    print(f"- {s['id']}: {s['title_en']}")
