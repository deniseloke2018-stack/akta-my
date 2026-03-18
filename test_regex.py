import re

text = """
Some text here
Communication, when complete
4. (1) The communication of a proposal is complete when it comes
to the knowledge...
“Coercion”
15. “Coercion” is the committing, or threatening to commit any
act forbidden by the Penal Code...
"""

SECTION_RE = re.compile(
    r"^([^\n]+)\n(\d+[A-Z]?)\.\s+([^\n]+\n(?:(?!^[^\n]+\n\d+[A-Z]?\.\s|^\bPART\b|^\bBAHAGIAN\b).+\n?)*)",
    re.MULTILINE,
)

for m in SECTION_RE.finditer(text):
    print("-----")
    print(f"TITLE: {m.group(1).strip()}")
    print(f"NUM  : {m.group(2).strip()}")
    print(f"CONT : {m.group(3).strip()[:50]}...")
