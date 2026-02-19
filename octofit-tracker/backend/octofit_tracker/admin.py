from django.contrib import admin
from .models import UserProfile, Activity, Team, Challenge, WorkoutSuggestion


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'fitness_level', 'total_points', 'created_at']
    list_filter = ['fitness_level']
    search_fields = ['user__username', 'user__email']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'duration', 'distance', 'points_earned', 'date']
    list_filter = ['activity_type', 'date']
    search_fields = ['user__username', 'notes']
    date_hierarchy = 'date'


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'coach', 'total_points', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['members']


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ['title', 'challenge_type', 'start_date', 'end_date', 'points_reward']
    list_filter = ['challenge_type', 'start_date']
    search_fields = ['title', 'description']
    filter_horizontal = ['participants']


@admin.register(WorkoutSuggestion)
class WorkoutSuggestionAdmin(admin.ModelAdmin):
    list_display = ['title', 'activity_type', 'fitness_level', 'duration']
    list_filter = ['fitness_level', 'activity_type']
    search_fields = ['title', 'description']
