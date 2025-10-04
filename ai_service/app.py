from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
import re

app = FastAPI()


class AnalyzeRequest(BaseModel):
    text: str


class CoachRequest(BaseModel):
    message: str
    appliedRole: str | None = None
    presentSkills: List[str] = []
    missingSkills: List[str] = []
    presentProjects: List[str] = []
    history: List[Dict[str, Any]] = []


@app.post("/analyze")
def analyze(req: AnalyzeRequest) -> Dict[str, Any]:
    base = (req.text or "").lower()
    base = re.sub(r"[^a-z0-9+.# ]+", " ", base)
    tokens = sorted(set(t for t in base.split() if t))
    return {"tokens": tokens}


@app.post("/coach")
def coach(req: CoachRequest) -> Dict[str, Any]:
    role = (req.appliedRole or "").strip().lower()
    present = [str(s).lower() for s in (req.presentSkills or [])]
    missing = [str(s).lower() for s in (req.missingSkills or [])]
    lines: List[str] = []
    lines.append("Here is a focused plan based on your role and skills.")
    if role:
        lines.append(f"Target role: {role}.")
    if present:
        lines.append("Strengths: " + ", ".join(sorted(set(present))) + ".")
    if missing:
        lines.append("Gaps to address: " + ", ".join(sorted(set(missing))) + ".")
    if req.message:
        lines.append("Your question: " + req.message)
    lines.append("Next steps: build 2-3 small projects to practice missing skills.")

    projects: List[Dict[str, Any]] = []
    for s in (missing or present)[:3]:
        s = str(s).lower()
        projects.append({
            "title": f"Practice {s} with a mini project",
            "requiredSkills": [s],
            "resources": [
                {"title": f"{s.title()} docs", "url": f"https://www.google.com/search?q={s}+docs"}
            ],
            "role": role,
        })

    reply = "\n".join(lines)
    return {"reply": reply, "projects": projects}

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
import re
import json
from pathlib import Path


APP_DIR = Path(__file__).resolve().parent
DATA_PATH = APP_DIR / "data" / "roles_skills.json"


def load_roles_skills() -> Dict[str, List[str]]:
    if DATA_PATH.exists():
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    # Fallback minimal mapping
    return {
        "frontend developer": [
            "javascript", "react", "html", "css", "typescript", "webpack", "testing"
        ],
        "backend developer": [
            "node", "express", "mongodb", "postgresql", "rest", "testing", "docker"
        ],
        "full stack developer": [
            "javascript", "react", "node", "express", "mongodb", "html", "css"
        ],
        "software developer": [
            "javascript", "react", "node", "express", "mongodb", "html", "css", "testing", "git"
        ],
    }


ROLES_SKILLS = load_roles_skills()


app = FastAPI(title="AI Resume Upskill - Local ML Service")


class AnalyzeRequest(BaseModel):
    text: str


class CoachRequest(BaseModel):
    message: str
    appliedRole: str | None = None
    presentSkills: List[str] = []
    missingSkills: List[str] = []
    presentProjects: List[str] = []
    history: List[Dict[str, Any]] = []


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze")
def analyze(req: AnalyzeRequest) -> Dict[str, Any]:
    # Lightweight token extraction suitable for skills lookup
    base = (req.text or "").lower()
    base = re.sub(r"[^a-z0-9+.# ]+", " ", base)
    tokens = sorted(set(t for t in base.split() if t))
    return {"tokens": tokens}


def build_projects(role: str | None, present_skills: List[str], missing_skills: List[str]) -> List[Dict[str, Any]]:
    role_key = (role or "").strip().lower()
    role_skills = ROLES_SKILLS.get(role_key, [])
    # Select 3 skills to focus on: prioritize missing, then reinforce present
    priorities = (missing_skills or []) + [s for s in role_skills if s in (present_skills or [])]
    seen = set()
    focus = []
    for s in priorities:
        ls = str(s).lower()
        if ls in seen:
            continue
        seen.add(ls)
        focus.append(ls)
        if len(focus) >= 3:
            break

    projects: List[Dict[str, Any]] = []
    for s in focus:
        title = f"Build a mini-project to practice {s}"
        resources = [
            {"title": f"{s.title()} Official Docs", "url": f"https://www.google.com/search?q={s}+official+docs"},
            {"title": f"Free course on {s}", "url": f"https://www.youtube.com/results?search_query={s}+tutorial"},
        ]
        projects.append({
            "title": title,
            "requiredSkills": [s],
            "resources": resources,
            "role": role_key,
        })
    return projects


@app.post("/coach")
def coach(req: CoachRequest) -> Dict[str, Any]:
    role = (req.appliedRole or "").strip().lower()
    present = [str(s).lower() for s in (req.presentSkills or [])]
    missing = [str(s).lower() for s in (req.missingSkills or [])]

    # Compose a deterministic reply using provided context
    lines: List[str] = []
    lines.append("Here is a focused plan based on your role and skills.")
    if role:
        lines.append(f"Target role: {role}.")
    if present:
        lines.append("Strengths: " + ", ".join(sorted(set(present))) + ".")
    if missing:
        lines.append("Gaps to address: " + ", ".join(sorted(set(missing))) + ".")
    if req.message:
        lines.append("Your question: " + req.message)
    lines.append("Next steps: work through the projects below and track progress weekly.")

    projects = build_projects(role, present, missing)

    reply = "\n".join(lines)
    return {"reply": reply, "projects": projects}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=False)


