from djongo import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile for OctoFit Tracker"""
    _id = models.ObjectIdField()
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    age = models.IntegerField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True, help_text="Height in cm")
    weight = models.FloatField(null=True, blank=True, help_text="Weight in kg")
    fitness_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ],
        default='beginner'
    )
    total_points = models.IntegerField(default=0)
    avatar = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Activity(models.Model):
    """Activity log for tracking workouts"""
    _id = models.ObjectIdField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(
        max_length=50,
        choices=[
            ('running', 'Running'),
            ('walking', 'Walking'),
            ('cycling', 'Cycling'),
            ('swimming', 'Swimming'),
            ('strength_training', 'Strength Training'),
            ('yoga', 'Yoga'),
            ('sports', 'Sports'),
            ('other', 'Other'),
        ]
    )
    duration = models.IntegerField(help_text="Duration in minutes")
    distance = models.FloatField(null=True, blank=True, help_text="Distance in km")
    calories = models.IntegerField(null=True, blank=True)
    points_earned = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activities'
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date.strftime('%Y-%m-%d')}"

    def save(self, *args, **kwargs):
        # Calculate points based on activity type and duration
        points_multiplier = {
            'running': 3,
            'walking': 1,
            'cycling': 2,
            'swimming': 3,
            'strength_training': 2,
            'yoga': 1,
            'sports': 2,
            'other': 1,
        }
        base_points = (self.duration // 10) * points_multiplier.get(self.activity_type, 1)
        self.points_earned = base_points
        super().save(*args, **kwargs)


class Team(models.Model):
    """Team for group competitions"""
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    coach = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='coached_teams')
    members = models.ManyToManyField(User, related_name='teams', blank=True)
    total_points = models.IntegerField(default=0)
    avatar = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'teams'
        ordering = ['-total_points']

    def __str__(self):
        return self.name

    def update_points(self):
        """Recalculate team points from all members' activities"""
        from django.db.models import Sum
        member_ids = self.members.values_list('id', flat=True)
        total = Activity.objects.filter(user_id__in=member_ids).aggregate(Sum('points_earned'))['points_earned__sum']
        self.total_points = total or 0
        self.save()


class Challenge(models.Model):
    """Fitness challenge for engagement"""
    _id = models.ObjectIdField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    challenge_type = models.CharField(
        max_length=50,
        choices=[
            ('distance', 'Distance'),
            ('duration', 'Duration'),
            ('frequency', 'Frequency'),
            ('points', 'Points'),
        ]
    )
    target_value = models.FloatField(help_text="Target value to achieve")
    activity_types = models.JSONField(default=list, blank=True, help_text="List of applicable activity types")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    points_reward = models.IntegerField(default=0)
    participants = models.ManyToManyField(User, related_name='challenges', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'challenges'
        ordering = ['-start_date']

    def __str__(self):
        return self.title


class WorkoutSuggestion(models.Model):
    """Personalized workout suggestions"""
    _id = models.ObjectIdField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    activity_type = models.CharField(max_length=50)
    fitness_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ]
    )
    duration = models.IntegerField(help_text="Suggested duration in minutes")
    instructions = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workout_suggestions'

    def __str__(self):
        return f"{self.title} ({self.fitness_level})"
