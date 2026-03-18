import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
client = create_client(url, key)

act_id = "act-136"

# Delete subsections, sections, parts, act
print("Deleting subsections...")
client.table("subsections").delete().like("id", f"{act_id}-%").execute()

print("Deleting sections...")
client.table("sections").delete().eq("act_id", act_id).execute()

print("Deleting parts...")
client.table("parts").delete().eq("act_id", act_id).execute()

print("Deleting act...")
client.table("acts").delete().eq("id", act_id).execute()

print("Cleanup complete!")
