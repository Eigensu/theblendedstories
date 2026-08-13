import os
import sys

def extract_conflicts(directory):
    for root, _, files in os.walk(directory):
        if '.git' in root or 'node_modules' in root or 'venv' in root or '.next' in root:
            continue
        for file in files:
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception:
                continue
            if '<<<<<<< HEAD' in content:
                print(f"\n--- CONFLICTS IN {path} ---")
                lines = content.split('\n')
                in_conflict = False
                for i, line in enumerate(lines):
                    if line.startswith('<<<<<<< HEAD'):
                        in_conflict = True
                        print(f"\n[Conflict starts at line {i+1}]")
                    if in_conflict:
                        print(line)
                    if line.startswith('>>>>>>> '):
                        in_conflict = False
                        print(f"[Conflict ends at line {i+1}]")

extract_conflicts('.')
