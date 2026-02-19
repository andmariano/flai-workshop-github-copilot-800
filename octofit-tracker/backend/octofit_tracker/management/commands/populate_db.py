from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from octofit_tracker.models import UserProfile, Activity, Team, WorkoutSuggestion
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Activity.objects.all().delete()
        WorkoutSuggestion.objects.all().delete()
        Team.objects.all().delete()
        UserProfile.objects.all().delete()
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Cleared existing data'))

        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes',
            total_points=0
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League United',
            total_points=0
        )
        self.stdout.write(self.style.SUCCESS('Created 2 teams'))

        # Create Users (Superheroes) - Marvel
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {
                'username': 'ironman',
                'email': 'tony.stark@marvel.com',
                'first_name': 'Tony',
                'last_name': 'Stark',
                'fitness_level': 'advanced'
           },
            {
                'username': 'captainamerica',
                'email': 'steve.rogers@marvel.com',
                'first_name': 'Steve',
                'last_name': 'Rogers',
                'fitness_level': 'advanced'
            },
            {
                'username': 'thor',
                'email': 'thor.odinson@marvel.com',
                'first_name': 'Thor',
                'last_name': 'Odinson',
                'fitness_level': 'advanced'
            },
            {
                'username': 'blackwidow',
                'email': 'natasha.romanoff@marvel.com',
                'first_name': 'Natasha',
                'last_name': 'Romanoff',
                'fitness_level': 'advanced'
            },
            {
                'username': 'hulk',
                'email': 'bruce.banner@marvel.com',
                'first_name': 'Bruce',
                'last_name': 'Banner',
                'fitness_level': 'advanced'
            }
        ]

        # Create Users - DC
        dc_heroes = [
            {
                'username': 'superman',
                'email': 'clark.kent@dc.com',
                'first_name': 'Clark',
                'last_name': 'Kent',
                'fitness_level': 'advanced'
            },
            {
                'username': 'batman',
                'email': 'bruce.wayne@dc.com',
                'first_name': 'Bruce',
                'last_name': 'Wayne',
                'fitness_level': 'advanced'
            },
            {
                'username': 'wonderwoman',
                'email': 'diana.prince@dc.com',
                'first_name': 'Diana',
                'last_name': 'Prince',
                'fitness_level': 'advanced'
            },
            {
                'username': 'flash',
                'email': 'barry.allen@dc.com',
                'first_name': 'Barry',
                'last_name': 'Allen',
                'fitness_level': 'intermediate'
            },
            {
                'username': 'aquaman',
                'email': 'arthur.curry@dc.com',
                'first_name': 'Arthur',
                'last_name': 'Curry',
                'fitness_level': 'intermediate'
            }
        ]

        # Create Marvel users and add to Team Marvel
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create_user(
                username=hero['username'],
                email=hero['email'],
                first_name=hero['first_name'],
                last_name=hero['last_name'],
                password='test123'
            )
            UserProfile.objects.create(
                user=user,
                fitness_level=hero['fitness_level'],
                height=random.randint(165, 195),
                weight=random.randint(65, 95),
                age=random.randint(25, 45),
                total_points=0
            )
            team_marvel.members.add(user)
            marvel_users.append(user)

        # Set first Marvel hero as coach
        team_marvel.coach = marvel_users[0]
        team_marvel.save()

        # Create DC users and add to Team DC
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create_user(
                username=hero['username'],
                email=hero['email'],
                first_name=hero['first_name'],
                last_name=hero['last_name'],
                password='test123'
            )
            UserProfile.objects.create(
                user=user,
                fitness_level=hero['fitness_level'],
                height=random.randint(165, 195),
                weight=random.randint(65, 95),
                age=random.randint(25, 45),
                total_points=0
            )
            team_dc.members.add(user)
            dc_users.append(user)

        # Set first DC hero as coach
        team_dc.coach = dc_users[0]
        team_dc.save()

        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))

        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['running', 'cycling', 'swimming', 'strength_training', 'yoga', 'walking', 'sports']
        activities_created = 0

        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                days_ago = random.randint(0, 30)
                activity_date = datetime.now() - timedelta(days=days_ago)
                
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                
                Activity.objects.create(
                    user=user,
                    activity_type=activity_type,
                    duration=duration,
                    distance=round(random.uniform(1.0, 15.0), 2) if activity_type in ['running', 'walking', 'cycling'] else None,
                    calories=random.randint(100, 800),
                    date=activity_date,
                    notes=f'{user.first_name}\'s {activity_type} session'
                )
                activities_created += 1

        self.stdout.write(self.style.SUCCESS(f'Created {activities_created} activities'))

        # Update team points
        team_marvel.update_points()
        team_dc.update_points()

        # Update user profile points
        for user in all_users:
            from django.db.models import Sum
            total_points = Activity.objects.filter(user=user).aggregate(Sum('points_earned'))['points_earned__sum'] or 0
            profile = user.profile
            profile.total_points = total_points
            profile.save()

        # Create Workouts (suggested workout plans)
        self.stdout.write('Creating workout suggestions...')
        workouts_data = [
            {
                'title': 'Super Soldier Training',
                'description': 'Captain America\'s intense workout routine for building strength and endurance',
                'activity_type': 'strength_training',
                'fitness_level': 'advanced',
                'duration': 60,
                'instructions': 'Push-ups: 5 sets of 50. Pull-ups: 5 sets of 20. Running: 30 minutes. Core exercises: 3 sets of 30.'
            },
            {
                'title': 'Asgardian Strength Training',
                'description': 'Thor\'s legendary workout for gods',
                'activity_type': 'strength_training',
                'fitness_level': 'advanced',
                'duration': 90,
                'instructions': 'Deadlifts: 5 sets of 10. Hammer swings: 4 sets of 20. Battle rope: 15 minutes. Overhead press: 5 sets of 12.'
            },
            {
                'title': 'Spy Agility Training',
                'description': 'Black Widow\'s agility and flexibility routine',
                'activity_type': 'yoga',
                'fitness_level': 'intermediate',
                'duration': 45,
                'instructions': 'Yoga flow: 20 minutes. Jump rope: 10 minutes. Martial arts practice: 15 minutes.'
            },
            {
                'title': 'Kryptonian Power Workout',
                'description': 'Superman\'s high-intensity training',
                'activity_type': 'strength_training',
                'fitness_level': 'advanced',
                'duration': 75,
                'instructions': 'Bench press: 5 sets of 15. Squats: 5 sets of 20. Box jumps: 4 sets of 15. Plank: 5 minutes.'
            },
            {
                'title': 'Dark Knight Training',
                'description': 'Batman\'s tactical fitness routine',
                'activity_type': 'sports',
                'fitness_level': 'advanced',
                'duration': 60,
                'instructions': 'Parkour training: 20 minutes. Martial arts drills: 20 minutes. Stealth exercises: 20 minutes.'
            },
            {
                'title': 'Speedster Cardio Blast',
                'description': 'Flash\'s speed and endurance training',
                'activity_type': 'running',
                'fitness_level': 'intermediate',
                'duration': 40,
                'instructions': 'Sprint intervals: 10 sets of 1 minute. High knees: 5 sets of 50. Burpees: 5 sets of 20.'
            },
            {
                'title': 'Amazon Warrior Training',
                'description': 'Wonder Woman\'s combat conditioning',
                'activity_type': 'strength_training',
                'fitness_level': 'advanced',
                'duration': 70,
                'instructions': 'Sword training: 20 minutes. Shield work: 20 minutes. Combat drills: 30 minutes.'
            },
            {
                'title': 'Atlantean Swimming',
                'description': 'Aquaman\'s underwater fitness program',
                'activity_type': 'swimming',
                'fitness_level': 'intermediate',
                'duration': 50,
                'instructions': 'Swimming laps: 30 minutes. Underwater resistance training: 15 minutes. Breath control: 5 minutes.'
            }
        ]

        for workout in workouts_data:
            WorkoutSuggestion.objects.create(**workout)

        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts_data)} workouts'))

        # Print summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams: {Team.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Profiles: {UserProfile.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'Workouts: {WorkoutSuggestion.objects.count()}')
        self.stdout.write(self.style.SUCCESS('\nDatabase successfully populated with superhero data!'))

