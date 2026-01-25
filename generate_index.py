
import os
import json
import frontmatter # Need to make sure if I can use this or regex. Envirnoment doesn't have it standard usually? I'll use regex to be safe.
import re
from datetime import datetime

# Regex for frontmatter
FM_REGEX = re.compile(r'^---\s+(.*?)\s+---', re.DOTALL)

def parse_frontmatter(content):
    match = FM_REGEX.match(content)
    if not match:
        return {}
    fm_text = match.group(1)
    data = {}
    for line in fm_text.split('\n'):
        if ':' in line:
            key, val = line.split(':', 1)
            data[key.strip()] = val.strip().strip('"').strip("'")
    return data

def main():
    # Adjust paths relative to script location or absolute
    base_dir = r"c:\Users\FLEBORGNE\OneDrive - ACCOR\Documents\GitHub\tmlvm-site"
    content_dir = os.path.join(base_dir, "content", "blog")
    output_file = os.path.join(base_dir, "articles.json")

    posts = []
    
    if not os.path.exists(content_dir):
        print(f"Directory not found: {content_dir}")
        return

    for filename in os.listdir(content_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(content_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            data = parse_frontmatter(content)
            slug = filename.replace('.md', '')
            
            # Extract content without frontmatter
            match = FM_REGEX.match(content)
            body = content[match.end():].strip() if match else content

            post = {
                "slug": slug,
                "title": data.get("title", slug),
                "category": data.get("category", "Général"),
                "publishedAt": data.get("publishedAt", "1970-01-01"),
                "excerpt": data.get("excerpt", ""),
                "keywords": data.get("keywords", "").replace('[', '').replace(']', '').split(','), # simple parse
                "file": f"content/blog/{filename}" # Relative path for fetching
            }
            posts.append(post)

    # Sort by date desc
    posts.sort(key=lambda x: x['publishedAt'], reverse=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    print(f"Generated articles.json with {len(posts)} articles.")

if __name__ == "__main__":
    main()
