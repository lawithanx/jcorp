# JCORP Portfolio

> **Quick Setup Reference**: See [SETUP.md](SETUP.md) for detailed port configuration, startup scripts, and development workflow.

A military-style, dossier-themed portfolio website showcasing security development and design projects. Built with a focus on cybersecurity, blockchain, and secure system architecture.

## Description

JCORP is a professional portfolio website that presents projects and services in a classified dossier format. The design features a military/law enforcement aesthetic with a strict color palette (black, white, silver, and neon green for active states). The portfolio displays projects as classified documents with folder tabs, while the about section presents team members as agents in a similar dossier style.

### Key Features

- **Dossier-Style Portfolio**: Projects are displayed as classified documents with folder tabs
- **Video Background Homepage**: Fullscreen video background with night vision effects
- **Agent Profile System**: About section with agent profiles in dossier format
- **Project Documentation**: Each project includes cover photos, white papers, specifications, and technical details
- **Responsive Design**: Mobile-friendly layout that maintains the military aesthetic
- **Overflow Tab Management**: Intelligent tab system that shows 4 tabs with a "MORE" indicator for additional projects

## Tech Stack

### Backend
- **Django 5.2.7**: Python web framework
- **Python 3.13+**: Programming language
- **SQLite3**: Database (development)

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with custom properties and animations
- **JavaScript**: Interactive functionality
- **Courier New**: Monospace font throughout

### Key Technologies & Tools
- **Django Templates**: Server-side rendering
- **Django Admin**: Content management interface
- **Static Files**: CSS, JavaScript, images
- **Media Files**: Video backgrounds, project images, documents
- **Django Management Commands**: Custom commands for data population

## Project Structure

```
JCORP/
├── main/                    # Main Django app
│   ├── models.py            # Project, ProjectImage, Partner models
│   ├── views.py             # Class-based views
│   ├── urls.py              # URL routing
│   ├── admin.py             # Admin interface configuration
│   └── management/           # Custom management commands
│       └── commands/
│           └── create_sample_projects.py
├── config/                   # Django project settings
│   ├── settings.py          # Configuration
│   ├── urls.py              # Main URL routing
│   └── wsgi.py              # WSGI configuration
├── templates/                # HTML templates
│   ├── base.html            # Base template
│   └── main/                # App-specific templates
│       ├── home.html
│       ├── portfolio.html
│       ├── about.html
│       ├── contact.html
│       └── project_detail.html
├── static/                   # Static files
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   └── main.js          # JavaScript functionality
│   └── images/              # Image assets
├── media/                    # User-uploaded files
│   ├── home-background.mp4  # Homepage video
│   └── projects/            # Project images and documents
└── requirements.txt          # Python dependencies
```

## Models

### Project
- Title, classification, description
- Project type and technologies
- GitHub and live URLs
- Featured image and additional images
- White paper (PDF/DOCX) and specifications
- Created/updated dates and active status

### Partner (Agent)
- Name and description
- Profile picture
- Display order and active status

### ProjectImage
- Additional images for projects
- Caption and ordering

## Setup & Installation

### Prerequisites
- Python 3.13+
- pip (Python package manager)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/lawithanx/jcorp.git
   cd jcorp/JCORP
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create sample data (optional)**
   ```bash
   python manage.py create_sample_projects
   ```

5. **Create superuser (for admin access)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```
   The server will automatically start on port 9441 (configured in settings).
   
   Or use the startup script:
   ```bash
   ./start.sh
   ```
   
   To use a different port, specify it explicitly:
   ```bash
   python manage.py runserver 0.0.0.0:8080
   ```

       7. **Access the application**
          - Django Backend: http://localhost:9441
          - React Frontend: http://localhost:9444
          - Admin: http://localhost:9441/admin

       8. **Start React Frontend** (in separate terminal)
          ```bash
          cd /home/jevon/DEV/JCORP/JCORP
          ./start.sh
          # OR
          cd frontend && PORT=9444 npm run dev
          ```

## Port Configuration

- **Django Backend**: Port `9441` (configured in `config/settings.py`)
- **React Frontend**: Port `9444` (configured via PORT environment variable in `start.sh`)
- **Virtual Environment**: `~/.virtualenvs/jcorp`

For detailed setup information, see [SETUP.md](SETUP.md).

## Design Philosophy

### Color Palette
- **Black**: Primary background
- **White**: Primary text and active states
- **Silver**: Accents and borders
- **Neon Green**: Active navigation and highlights only

### Typography
- **Font**: Courier New (monospace)
- **Style**: Military/classified document aesthetic

### Layout
- **Portfolio**: Dossier-style documents with folder tabs
- **Navigation**: Fixed header with conditional background
- **Responsive**: Mobile-first design with adaptive layouts

## Features

### Portfolio Page
- Maximum 4 visible tabs with "MORE" indicator
- Tab overflow management with dropdown menu
- Project details with cover photos and documentation
- White paper download/view functionality
- Technical specifications display

### About Page
- Single agent profile display
- Dossier-style document format
- Profile picture and description

### Home Page
- Fullscreen video background
- Night vision effects
- Download Business Card button

## Customization

### Adding Projects
1. Access Django admin at `/admin`
2. Navigate to "Projects"
3. Add new project with all details
4. Upload featured image, white paper, and additional images

### Adding Agents
1. Access Django admin at `/admin`
2. Navigate to "Agents"
3. Add agent profile with description and image

### Background Image
Place your background image at:
```
static/images/header-footer-bg.jpg
```
This image will be used for:
- Portfolio section background
- Header background (on portfolio pages only)

## Development

### Running Tests
```bash
python manage.py test
```

### Collecting Static Files
```bash
python manage.py collectstatic
```

### Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

## License

Copyright © 2025 JCORP. All rights reserved.

## Contact

For inquiries about this portfolio, please visit the contact page or refer to the agent profile in the About section.

