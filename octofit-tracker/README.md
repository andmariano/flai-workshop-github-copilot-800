# OctoFit Tracker - Project Setup Complete! 🏃‍♂️

## Project Overview
OctoFit Tracker is a comprehensive fitness tracking application designed for Mergington High School. It helps students log activities, join teams, participate in challenges, and get personalized workout suggestions.

## Technology Stack
- **Frontend**: React.js with Bootstrap
- **Backend**: Django REST Framework
- **Database**: MongoDB (via djongo)
- **Development Environment**: GitHub Codespaces

## Project Structure
```
octofit-tracker/
├── backend/
│   ├── venv/                       # Python virtual environment
│   ├── octofit_tracker/
│   │   ├── models.py              # Database models
│   │   ├── serializers.py         # REST API serializers
│   │   ├── views.py               # API views and viewsets
│   │   ├── urls.py                # URL routing
│   │   ├── settings.py            # Django settings
│   │   ├── admin.py               # Admin panel configuration
│   │   └── management/
│   │       └── commands/
│   │           └── populate_db.py # Database population script
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/            # React components
    │   ├── services/              # API service layer
    │   ├── App.js                 # Main app component
    │   └── index.js               # Entry point
    ├── public/
    ├── package.json
    └── .env                       # Environment variables
```

## Features Implemented

### Backend (Django REST API)
✅ **Models Created:**
- UserProfile - Extended user profiles with fitness data
- Activity - Activity logging and tracking
- Team - Team management for competition
- Challenge - Fitness challenges
- WorkoutSuggestion - Personalized workout recommendations

✅ **API Endpoints:**
- `/api/users/` - User management
- `/api/profiles/` - User profiles with me/update_me endpoints
- `/api/activities/` - Activity CRUD with summary and filtering
- `/api/teams/` - Team management with join/leave functionality
- `/api/challenges/` - Challenge management with join/leave
- `/api/workouts/` - Workout suggestions with filtering
- `/api/leaderboard/` - User and team leaderboards

✅ **Features:**
- Automatic point calculation for activities
- Team point aggregation
- Activity filtering by type, date, and user
- Challenge participation tracking
- Personalized workout suggestions
- Codespace-aware URL configuration

### Frontend (React)
✅ **Components Created:**
- Home - Landing page with feature overview
- Dashboard - User activity summary and quick actions
- Activities - Activity logging and history
- Teams - Team creation and management
- Challenges - Challenge browsing and participation
- Leaderboard - User and team rankings
- WorkoutSuggestions - Filtered workout recommendations

✅ **Features:**
- Bootstrap-styled responsive UI
- React Router navigation
- API service layer for backend communication
- Form handling for activity logging
- Real-time leaderboard updates
- Filtering capabilities for challenges and workouts

## Running the Application

### Backend (Django)
1. Navigate to the backend directory:
   ```bash
   cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. Start the Django development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

The backend API will be available at:
- Local: `http://localhost:8000/api/`
- Codespace: `https://<CODESPACE_NAME>-8000.app.github.dev/api/`

### Frontend (React)
1. Navigate to the frontend directory:
   ```bash
   cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at:
- Local: `http://localhost:3000`
- Codespace: `https://<CODESPACE_NAME>-3000.app.github.dev`

## Database Setup
MongoDB is already running in the Codespace environment on port 27017. The database `octofit_db` is automatically created when you run migrations.

To populate the database with sample data:
```bash
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend
source venv/bin/activate
python manage.py populate_db
```

## Admin Panel
Access the Django admin panel at:
- Local: `http://localhost:8000/admin/`
- Codespace: `https://<CODESPACE_NAME>-8000.app.github.dev/admin/`

To create an admin user:
```bash
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend
source venv/bin/activate
python manage.py createsuperuser
```

## Testing the API
You can test the API endpoints using curl:

```bash
# Get API root
curl http://localhost:8000/api/

# Get leaderboard
curl http://localhost:8000/api/leaderboard/

# Get teams
curl http://localhost:8000/api/teams/

# Get challenges
curl http://localhost:8000/api/challenges/
```

## Environment Variables

### Backend
Configure in `octofit-tracker/backend/octofit_tracker/settings.py`:
- MongoDB connection settings
- ALLOWED_HOSTS (automatically configured for Codespaces)
- CORS settings

### Frontend
Configure in `octofit-tracker/frontend/.env`:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8000/api)

## Next Steps
1. Create a superuser for the admin panel
2. Populate the database with sample data
3. Start both backend and frontend servers
4. Test the application features
5. Customize styling and add more features as needed

## Additional Resources
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Support
For issues or questions, refer to:
- [AGENTS.md](../../AGENTS.md) - Agent mode guidelines
- [TROUBLESHOOTING.md](../../.github/TROUBLESHOOTING.md) - Common issues
- [Story Document](../../docs/octofit_story.md) - Application requirements

---
Built with ❤️ using GitHub Copilot agent mode
