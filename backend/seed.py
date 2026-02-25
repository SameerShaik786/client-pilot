"""Seed the database with realistic dummy data.

Usage:
    cd backend
    .\\venv\\Scripts\\python seed.py
"""

from datetime import date, timedelta
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.client import Client
from app.models.project import Project
from app.models.deliverable import Deliverable


def seed():
    app = create_app()

    with app.app_context():
        print("Clearing existing data...")
        Deliverable.query.delete()
        Project.query.delete()
        Client.query.delete()

        # Find or create a test user
        user = User.query.first()
        if not user:
            user = User(username="demo", email="demo@clientpilot.io")
            user.set_password("password123")
            db.session.add(user)
            db.session.flush()
            print(f"Created user: {user.email}")
        else:
            print(f"Using existing user: {user.email}")

        uid = user.id

        # ── Clients ──────────────────────────────────────────────
        clients_data = [
            {"name": "Acme Corp", "email": "contact@acme.com", "company": "Acme Corporation", "notes": "Enterprise client, annual contract"},
            {"name": "Nova Studios", "email": "hello@novastudios.io", "company": "Nova Studios", "notes": "Design-focused, fast turnarounds"},
            {"name": "Zenith Labs", "email": "ops@zenithlabs.com", "company": "Zenith Labs", "notes": "R&D heavy, flexible deadlines"},
            {"name": "Orbit Digital", "email": "team@orbitdigital.co", "company": "Orbit Digital Agency", "notes": "Marketing agency, multiple projects"},
        ]

        clients = []
        for cd in clients_data:
            c = Client(user_id=uid, **cd)
            db.session.add(c)
            clients.append(c)
        db.session.flush()
        print(f"Created {len(clients)} clients")

        # ── Projects ─────────────────────────────────────────────
        today = date.today()
        projects_data = [
            # Acme Corp projects
            {"client": 0, "title": "Website Redesign", "description": "Full redesign of the corporate website with modern UI", "status": "active", "deadline": today + timedelta(days=30)},
            {"client": 0, "title": "Mobile App MVP", "description": "Cross-platform mobile app for customer portal", "status": "active", "deadline": today + timedelta(days=60)},
            {"client": 0, "title": "Brand Guidelines", "description": "Updated brand book and asset library", "status": "completed", "deadline": today - timedelta(days=10)},

            # Nova Studios projects
            {"client": 1, "title": "E-Commerce Platform", "description": "Shopify custom theme + integrations", "status": "active", "deadline": today + timedelta(days=45)},
            {"client": 1, "title": "Social Media Dashboard", "description": "Analytics dashboard for social campaigns", "status": "on_hold", "deadline": today + timedelta(days=90)},

            # Zenith Labs projects
            {"client": 2, "title": "Data Pipeline", "description": "ETL pipeline for research data processing", "status": "active", "deadline": today + timedelta(days=20)},
            {"client": 2, "title": "Internal Tools Portal", "description": "Admin dashboard for lab operations", "status": "active", "deadline": today + timedelta(days=15)},

            # Orbit Digital projects
            {"client": 3, "title": "Campaign Landing Pages", "description": "5 landing pages for Q1 campaign launch", "status": "active", "deadline": today + timedelta(days=7)},
            {"client": 3, "title": "SEO Audit Report", "description": "Comprehensive SEO audit and recommendations", "status": "completed", "deadline": today - timedelta(days=5)},
        ]

        projects = []
        for pd in projects_data:
            p = Project(
                client_id=clients[pd["client"]].id,
                title=pd["title"],
                description=pd["description"],
                deadline=pd["deadline"],
            )
            p.status = pd["status"]
            db.session.add(p)
            projects.append(p)
        db.session.flush()
        print(f"Created {len(projects)} projects")

        # ── Deliverables ─────────────────────────────────────────
        deliverables_data = [
            # Website Redesign (project 0)
            {"project": 0, "title": "Wireframes & Mockups", "status": "completed", "due": today - timedelta(days=5)},
            {"project": 0, "title": "Homepage Development", "status": "in_progress", "due": today + timedelta(days=10)},
            {"project": 0, "title": "About Page", "status": "planned", "due": today + timedelta(days=18)},
            {"project": 0, "title": "Contact Form Integration", "status": "planned", "due": today + timedelta(days=25)},
            {"project": 0, "title": "Performance Optimization", "status": "planned", "due": today + timedelta(days=28)},

            # Mobile App MVP (project 1)
            {"project": 1, "title": "UI/UX Design", "status": "completed", "due": today - timedelta(days=3)},
            {"project": 1, "title": "Authentication Module", "status": "in_progress", "due": today + timedelta(days=12)},
            {"project": 1, "title": "Dashboard Screen", "status": "planned", "due": today + timedelta(days=30)},
            {"project": 1, "title": "Push Notifications", "status": "planned", "due": today + timedelta(days=45)},

            # Brand Guidelines (project 2 — completed)
            {"project": 2, "title": "Logo Variations", "status": "completed", "due": today - timedelta(days=15)},
            {"project": 2, "title": "Color Palette", "status": "completed", "due": today - timedelta(days=12)},
            {"project": 2, "title": "Typography Guide", "status": "completed", "due": today - timedelta(days=10)},

            # E-Commerce Platform (project 3)
            {"project": 3, "title": "Theme Customization", "status": "in_progress", "due": today + timedelta(days=14)},
            {"project": 3, "title": "Payment Gateway", "status": "planned", "due": today + timedelta(days=25)},
            {"project": 3, "title": "Inventory Sync", "status": "planned", "due": today + timedelta(days=35)},
            {"project": 3, "title": "Launch Checklist", "status": "planned", "due": today + timedelta(days=42)},

            # Data Pipeline (project 5)
            {"project": 5, "title": "Schema Design", "status": "completed", "due": today - timedelta(days=2)},
            {"project": 5, "title": "Ingestion Workers", "status": "in_progress", "due": today + timedelta(days=8)},
            {"project": 5, "title": "Transformation Layer", "status": "planned", "due": today + timedelta(days=15)},
            {"project": 5, "title": "Monitoring Dashboard", "status": "planned", "due": today + timedelta(days=18)},

            # Internal Tools Portal (project 6)
            {"project": 6, "title": "User Management", "status": "in_progress", "due": today + timedelta(days=5)},
            {"project": 6, "title": "Reporting Module", "status": "blocked", "due": today - timedelta(days=1)},
            {"project": 6, "title": "Export System", "status": "planned", "due": today + timedelta(days=12)},

            # Campaign Landing Pages (project 7)
            {"project": 7, "title": "Hero Section Design", "status": "completed", "due": today - timedelta(days=3)},
            {"project": 7, "title": "A/B Test Variants", "status": "in_progress", "due": today + timedelta(days=3)},
            {"project": 7, "title": "Analytics Tracking", "status": "planned", "due": today - timedelta(days=1)},
            {"project": 7, "title": "Form Integrations", "status": "planned", "due": today + timedelta(days=5)},
        ]

        count = 0
        for dd in deliverables_data:
            d = Deliverable(
                project_id=projects[dd["project"]].id,
                title=dd["title"],
                due_date=dd["due"],
            )
            d.status = dd["status"]
            db.session.add(d)
            count += 1
        
        db.session.commit()
        print(f"Created {count} deliverables")
        print("\nDatabase seeded successfully!")
        print(f"   Login: {user.email} / password123")


if __name__ == "__main__":
    seed()
