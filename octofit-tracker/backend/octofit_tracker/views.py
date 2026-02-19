from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Count, Sum, Q
from django.utils import timezone
from .models import UserProfile, Activity, Team, Challenge, WorkoutSuggestion
from .serializers import (
    UserSerializer, UserProfileSerializer, ActivitySerializer, 
    ActivityCreateSerializer, TeamSerializer, TeamCreateSerializer,
    ChallengeSerializer, WorkoutSuggestionSerializer, LeaderboardSerializer
)


@api_view(['GET'])
def api_root(request):
    """API root endpoint showing available endpoints"""
    import os
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"
    
    return Response({
        'message': 'Welcome to OctoFit Tracker API',
        'endpoints': {
            'users': f'{base_url}/api/users/',
            'profiles': f'{base_url}/api/profiles/',
            'activities': f'{base_url}/api/activities/',
            'teams': f'{base_url}/api/teams/',
            'challenges': f'{base_url}/api/challenges/',
            'workouts': f'{base_url}/api/workouts/',
            'leaderboard': f'{base_url}/api/leaderboard/',
        }
    })


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter profiles based on user permissions"""
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_me(self, request):
        """Update current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityViewSet(viewsets.ModelViewSet):
    """ViewSet for activities"""
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter activities based on user"""
        queryset = Activity.objects.all()
        
        # Filter by user
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        elif not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filter by activity type
        activity_type = self.request.query_params.get('type', None)
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset

    def get_serializer_class(self):
        """Use different serializers for create vs read"""
        if self.action == 'create':
            return ActivityCreateSerializer
        return ActivitySerializer

    def perform_create(self, serializer):
        """Create activity and update user profile points"""
        activity = serializer.save(user=self.request.user)
        
        # Update user profile total points
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        profile.total_points += activity.points_earned
        profile.save()
        
        # Update team points if user is in a team
        for team in self.request.user.teams.all():
            team.update_points()

    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """Get current user's activities"""
        activities = Activity.objects.filter(user=request.user)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get activity summary for current user"""
        activities = Activity.objects.filter(user=request.user)
        
        total_activities = activities.count()
        total_duration = activities.aggregate(Sum('duration'))['duration__sum'] or 0
        total_distance = activities.aggregate(Sum('distance'))['distance__sum'] or 0
        total_points = activities.aggregate(Sum('points_earned'))['points_earned__sum'] or 0
        
        activity_breakdown = {}
        for activity_type in ['running', 'walking', 'cycling', 'swimming', 'strength_training', 'yoga', 'sports']:
            count = activities.filter(activity_type=activity_type).count()
            if count > 0:
                activity_breakdown[activity_type] = count
        
        return Response({
            'total_activities': total_activities,
            'total_duration': total_duration,
            'total_distance': total_distance,
            'total_points': total_points,
            'activity_breakdown': activity_breakdown
        })


class TeamViewSet(viewsets.ModelViewSet):
    """ViewSet for teams"""
    queryset = Team.objects.all().prefetch_related('members', 'coach')
    serializer_class = TeamSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Optimize queryset with prefetch_related"""
        return Team.objects.all().prefetch_related('members', 'coach')

    def get_serializer_class(self):
        """Use different serializers for create vs read"""
        if self.action == 'create':
            return TeamCreateSerializer
        return TeamSerializer

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Join a team"""
        team = self.get_object()
        user = request.user
        
        if user in team.members.all():
            return Response(
                {'message': 'You are already a member of this team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        team.members.add(user)
        team.update_points()
        
        serializer = self.get_serializer(team)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Leave a team"""
        team = self.get_object()
        user = request.user
        
        if user not in team.members.all():
            return Response(
                {'message': 'You are not a member of this team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if team.coach == user:
            return Response(
                {'message': 'Team coach cannot leave the team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        team.members.remove(user)
        team.update_points()
        
        return Response({'message': 'Successfully left the team'})

    @action(detail=False, methods=['get'])
    def my_teams(self, request):
        """Get teams the current user is a member of"""
        teams = Team.objects.filter(members=request.user).prefetch_related('members', 'coach')
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)


class ChallengeViewSet(viewsets.ModelViewSet):
    """ViewSet for challenges"""
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter challenges based on status"""
        queryset = Challenge.objects.all()
        
        # Filter by active status
        active = self.request.query_params.get('active', None)
        if active == 'true':
            now = timezone.now()
            queryset = queryset.filter(start_date__lte=now, end_date__gte=now)
        
        return queryset

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Join a challenge"""
        challenge = self.get_object()
        user = request.user
        
        if user in challenge.participants.all():
            return Response(
                {'message': 'You are already participating in this challenge'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        challenge.participants.add(user)
        
        serializer = self.get_serializer(challenge)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Leave a challenge"""
        challenge = self.get_object()
        user = request.user
        
        if user not in challenge.participants.all():
            return Response(
                {'message': 'You are not participating in this challenge'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        challenge.participants.remove(user)
        
        return Response({'message': 'Successfully left the challenge'})

    @action(detail=False, methods=['get'])
    def my_challenges(self, request):
        """Get challenges the current user is participating in"""
        challenges = Challenge.objects.filter(participants=request.user)
        serializer = self.get_serializer(challenges, many=True)
        return Response(serializer.data)


class WorkoutSuggestionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for workout suggestions"""
    queryset = WorkoutSuggestion.objects.all()
    serializer_class = WorkoutSuggestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter workout suggestions based on fitness level"""
        queryset = WorkoutSuggestion.objects.all()
        
        # Filter by fitness level
        fitness_level = self.request.query_params.get('fitness_level', None)
        if fitness_level:
            queryset = queryset.filter(fitness_level=fitness_level)
        
        # Filter by activity type
        activity_type = self.request.query_params.get('activity_type', None)
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
        
        return queryset

    @action(detail=False, methods=['get'])
    def for_me(self, request):
        """Get workout suggestions for current user's fitness level"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            suggestions = WorkoutSuggestion.objects.filter(fitness_level=profile.fitness_level)
            serializer = self.get_serializer(suggestions, many=True)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {'message': 'Please complete your profile first'},
                status=status.HTTP_400_BAD_REQUEST
            )


@api_view(['GET'])
def leaderboard(request):
    """Get leaderboard with top users by points"""
    limit = int(request.query_params.get('limit', 10))
    
    # Get user profiles ordered by points
    profiles = UserProfile.objects.select_related('user').order_by('-total_points')[:limit]
    
    leaderboard_data = []
    for rank, profile in enumerate(profiles, start=1):
        activity_count = Activity.objects.filter(user=profile.user).count()
        
        # Calculate total calories
        from django.db.models import Sum
        total_calories = Activity.objects.filter(user=profile.user).aggregate(
            Sum('calories')
        )['calories__sum'] or 0
        
        # Get user's primary team (first team they're a member of)
        user_team = Team.objects.filter(members=profile.user).first()
        team_name = user_team.name if user_team else None
        
        leaderboard_data.append({
            'user_id': profile.user.id,
            'username': profile.user.username,
            'total_points': profile.total_points,
            'activity_count': activity_count,
            'total_calories': total_calories,
            'team_name': team_name,
            'rank': rank
        })
    
    serializer = LeaderboardSerializer(leaderboard_data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def team_leaderboard(request):
    """Get team leaderboard"""
    limit = int(request.query_params.get('limit', 10))
    
    teams = Team.objects.all().order_by('-total_points')[:limit]
    
    team_data = []
    for rank, team in enumerate(teams, start=1):
        team_data.append({
            'team_id': team.id,
            'team_name': team.name,
            'total_points': team.total_points,
            'member_count': team.members.count(),
            'rank': rank
        })
    
    return Response(team_data)
