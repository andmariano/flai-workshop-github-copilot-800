from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Activity, Team, Challenge, WorkoutSuggestion


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']

    def get_profile(self, obj):
        """Return a minimal nested representation of the user's profile"""
        profile = getattr(obj, 'profile', None)
        if profile is None:
            return None
        return {
            'fitness_level': getattr(profile, 'fitness_level', None),
            'height': getattr(profile, 'height', None),
            'weight': getattr(profile, 'weight', None),
            'bio': getattr(profile, 'bio', None),
        }


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    _id = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['_id', 'user', 'age', 'height', 'weight', 'fitness_level', 
                  'total_points', 'bio', 'avatar', 'created_at', 'updated_at']
        read_only_fields = ['_id', 'total_points', 'created_at', 'updated_at']

    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'user', 'user_name', 'activity_type', 'duration', 
                  'distance', 'calories', 'points_earned', 'notes', 'date', 'created_at']
        read_only_fields = ['_id', 'points_earned', 'created_at']

    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None


class ActivityCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating activities"""
    class Meta:
        model = Activity
        fields = ['activity_type', 'duration', 'distance', 'calories', 'notes', 'date']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user'):
            raise serializers.ValidationError("Authentication context is required to create an activity.")
        validated_data['user'] = request.user
        return super().create(validated_data)


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model"""
    coach_name = serializers.CharField(source='coach.username', read_only=True)
    member_count = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', '_id', 'name', 'description', 'coach', 'coach_name', 
                  'members', 'member_count', 'total_points', 'avatar', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', '_id', 'total_points', 'created_at', 'updated_at']

    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None

    def get_member_count(self, obj):
        """Get the number of members in the team"""
        return obj.members.count()


class TeamCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating teams"""
    class Meta:
        model = Team
        fields = ['name', 'description', 'avatar']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user'):
            raise serializers.ValidationError("Authentication context is required to create a team.")
        validated_data['coach'] = request.user
        team = Team.objects.create(**validated_data)
        team.members.add(request.user)
        return team


class ChallengeSerializer(serializers.ModelSerializer):
    """Serializer for Challenge model"""
    participant_count = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Challenge
        fields = ['_id', 'title', 'description', 'challenge_type', 'target_value',
                  'activity_types', 'start_date', 'end_date', 'points_reward',
                  'participant_count', 'is_active', 'created_at']
        read_only_fields = ['_id', 'created_at']

    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None

    def get_participant_count(self, obj):
        """Get the number of participants"""
        return obj.participants.count()

    def get_is_active(self, obj):
        """Check if challenge is currently active"""
        from django.utils import timezone
        now = timezone.now()
        return obj.start_date <= now <= obj.end_date


class WorkoutSuggestionSerializer(serializers.ModelSerializer):
    """Serializer for WorkoutSuggestion model"""
    _id = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutSuggestion
        fields = ['_id', 'title', 'description', 'activity_type', 'fitness_level',
                  'duration', 'instructions', 'video_url', 'created_at']
        read_only_fields = ['_id', 'created_at']

    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard data"""
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    total_points = serializers.IntegerField()
    activity_count = serializers.IntegerField()
    total_calories = serializers.IntegerField()
    team_name = serializers.CharField(allow_null=True)
    rank = serializers.IntegerField()
