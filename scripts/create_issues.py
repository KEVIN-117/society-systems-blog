import os
import re
import subprocess
from pathlib import Path

plan_content = Path("PLAN.md").read_text(encoding="utf-8")

# Extract the tickets block which starts at "## 2. Backlog Refinado y Priorizado"
start_idx = plan_content.find("## 2. Backlog Refinado y Priorizado")
if start_idx != -1:
    plan_content = plan_content[start_idx:]

pattern = re.compile(r"####\s+(\[(ID-[^\]]+)\]\s+([^\n]+))\n(.*?)(?=\n#### |\n## |\Z)", re.DOTALL)
matches = pattern.findall(plan_content)

if not matches:
    print("No issues found in PLAN.md")
else:
    for match in matches:
        full_title = match[0].strip()
        ticket_id = match[1].strip()
        body_content = match[3].strip()
        
        temp_file = Path(f"temp_issue_{ticket_id}.md")
        temp_file.write_text(body_content, encoding="utf-8")
        
        cmd = ["gh", "issue", "create", "--title", full_title, "--body-file", str(temp_file)]
        
        print(f"Creating issue: {full_title}")
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if result.returncode == 0:
            print(f"Success: {result.stdout.strip()}")
        else:
            print(f"Error: {result.stderr.strip()}")
            
        temp_file.unlink(missing_ok=True)

print("All issues processed.")
