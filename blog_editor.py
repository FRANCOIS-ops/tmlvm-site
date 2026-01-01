import os
import subprocess
import tkinter as tk
from tkinter import messagebox
from datetime import datetime
import re

# ======================
# CONFIG
# ======================

BLOG_DIR = "content/blog"

# ======================
# UTILS
# ======================

def slugify(text):
    text = text.lower()
    text = re.sub(r"[àâä]", "a", text)
    text = re.sub(r"[éèêë]", "e", text)
    text = re.sub(r"[îï]", "i", text)
    text = re.sub(r"[ôö]", "o", text)
    text = re.sub(r"[ùûü]", "u", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def run_git(command):
    result = subprocess.run(
        command,
        shell=True,
        capture_output=True,
        text=True
    )
    return result.returncode, result.stdout, result.stderr

def git_save_and_push(commit_message):
    # 1️⃣ Toujours se synchroniser avec GitHub
    code, out, err = run_git("git pull --rebase")
    if code != 0:
        raise Exception(f"Git pull failed:\n{err or out}")

    # 2️⃣ Ajouter les fichiers
    code, _, err = run_git("git add .")
    if code != 0:
        raise Exception(f"Git add failed:\n{err}")

    # 3️⃣ Commit
    code, out, err = run_git(f'git commit -m "{commit_message}"')
    if code != 0:
        if "nothing to commit" not in err.lower():
            raise Exception(f"Git commit failed:\n{err}")

    # 4️⃣ Push
    code, _, err = run_git("git push")
    if code != 0:
        raise Exception(f"Git push failed:\n{err}")

# ======================
# SAVE ARTICLE
# ======================

def save_article(push_to_git=False):
    title = title_entry.get().strip()
    date = date_entry.get().strip()
    slug = slug_entry.get().strip()
    tags = tags_entry.get().strip()
    excerpt = excerpt_entry.get().strip()
    content = content_text.get("1.0", tk.END).strip()
    draft = draft_var.get()

    if not title or not slug or not content:
        messagebox.showerror("Erreur", "Titre, slug et contenu sont obligatoires.")
        return

    if not re.match(r"\d{4}-\d{2}-\d{2}", date):
        messagebox.showerror("Erreur", "Date invalide (YYYY-MM-DD).")
        return

    os.makedirs(BLOG_DIR, exist_ok=True)

    filepath = os.path.join(BLOG_DIR, f"{slug}.md")

    frontmatter = f"""---
title: "{title}"
date: {date}
slug: {slug}
tags: [{tags}]
excerpt: "{excerpt}"
draft: {str(draft).lower()}
---

"""

    try:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(frontmatter + content)

        if push_to_git:
            git_save_and_push(f"Add blog article: {slug}")
            messagebox.showinfo(
                "Succès",
                "Article enregistré et publié 🚀\nNetlify va rebuild automatiquement."
            )
        else:
            messagebox.showinfo("Succès", "Article enregistré (sans publication).")

    except Exception as e:
        messagebox.showerror("Erreur", str(e))

# ======================
# UI
# ======================

root = tk.Tk()
root.title("TMLVM — Blog Editor")
root.geometry("900x700")

frame = tk.Frame(root)
frame.pack(fill="both", expand=True, padx=10, pady=10)

# Title
tk.Label(frame, text="Titre").grid(row=0, column=0, sticky="w")
title_entry = tk.Entry(frame, width=80)
title_entry.grid(row=0, column=1, sticky="w")

# Date
tk.Label(frame, text="Date (YYYY-MM-DD)").grid(row=1, column=0, sticky="w")
date_entry = tk.Entry(frame)
date_entry.insert(0, datetime.now().strftime("%Y-%m-%d"))
date_entry.grid(row=1, column=1, sticky="w")

# Slug
tk.Label(frame, text="Slug (nom fichier)").grid(row=2, column=0, sticky="w")
slug_entry = tk.Entry(frame, width=50)
slug_entry.grid(row=2, column=1, sticky="w")

def generate_slug():
    slug_entry.delete(0, tk.END)
    slug_entry.insert(0, slugify(title_entry.get()))

tk.Button(frame, text="Générer slug", command=generate_slug).grid(row=2, column=2)

# Tags
tk.Label(frame, text="Tags (séparés par virgules)").grid(row=3, column=0, sticky="w")
tags_entry = tk.Entry(frame, width=80)
tags_entry.grid(row=3, column=1, sticky="w")

# Excerpt
tk.Label(frame, text="Résumé (excerpt)").grid(row=4, column=0, sticky="w")
excerpt_entry = tk.Entry(frame, width=80)
excerpt_entry.grid(row=4, column=1, sticky="w")

# Draft
draft_var = tk.BooleanVar()
tk.Checkbutton(frame, text="Draft", variable=draft_var).grid(row=5, column=1, sticky="w")

# Content
tk.Label(frame, text="Contenu (Markdown)").grid(row=6, column=0, sticky="nw")
content_text = tk.Text(frame, height=20)
content_text.grid(row=6, column=1, columnspan=2, sticky="nsew")

frame.grid_rowconfigure(6, weight=1)
frame.grid_columnconfigure(1, weight=1)

# Buttons
button_frame = tk.Frame(root)
button_frame.pack(pady=10)

tk.Button(button_frame, text="Enregistrer (fichier)", command=lambda: save_article(False)).pack(side="left", padx=5)
tk.Button(button_frame, text="Enregistrer + Git push 🚀", command=lambda: save_article(True)).pack(side="left", padx=5)

root.mainloop()
