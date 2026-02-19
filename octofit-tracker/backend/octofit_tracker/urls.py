"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from octofit_tracker.views import (
    api_root, UserViewSet, UserProfileViewSet, ActivityViewSet,
    TeamViewSet, ChallengeViewSet, WorkoutSuggestionViewSet,
    leaderboard, team_leaderboard
)
import os

# Get codespace URL if available
codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'workouts', WorkoutSuggestionViewSet, basename='workout')

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False), name='index'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('api/leaderboard/', leaderboard, name='leaderboard'),
    path('api/team-leaderboard/', team_leaderboard, name='team-leaderboard'),
]

