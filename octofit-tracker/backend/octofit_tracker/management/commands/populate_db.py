from django.core.management.base import BaseCommand
from pymongo import MongoClient
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Connected to MongoDB'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email field
        db.users.create_index([('email', 1)], unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))

        # Create Teams
        teams_data = [
            {
                '_id': 1,
                'name': 'Team Marvel',
                'description': 'Earth\'s Mightiest Heroes',
                'created_at': datetime.now(),
                'member_count': 0
            },
            {
                '_id': 2,
                'name': 'Team DC',
                'description': 'Justice League United',
                'created_at': datetime.now(),
                'member_count': 0
            }
        ]
        db.teams.insert_many(teams_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(teams_data)} teams'))

        # Create Users (Superheroes)
        marvel_heroes = [
            {
                '_id': 1,
                'username': 'ironman',
                'email': 'tony.stark@marvel.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Tony',
                'last_name': 'Stark',
                'team_id': 1,
                'hero_name': 'Iron Man',
                'power': 'Genius intellect, powered armor',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 2,
                'username': 'captainamerica',
                'email': 'steve.rogers@marvel.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Steve',
                'last_name': 'Rogers',
                'team_id': 1,
                'hero_name': 'Captain America',
                'power': 'Super soldier serum, vibranium shield',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 3,
                'username': 'thor',
                'email': 'thor.odinson@marvel.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Thor',
                'last_name': 'Odinson',
                'team_id': 1,
                'hero_name': 'Thor',
                'power': 'God of Thunder, Mjolnir',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 4,
                'username': 'blackwidow',
                'email': 'natasha.romanoff@marvel.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Natasha',
                'last_name': 'Romanoff',
                'team_id': 1,
                'hero_name': 'Black Widow',
                'power': 'Master spy, expert martial artist',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 5,
                'username': 'hulk',
                'email': 'bruce.banner@marvel.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Bruce',
                'last_name': 'Banner',
                'team_id': 1,
                'hero_name': 'Hulk',
                'power': 'Superhuman strength, regeneration',
                'created_at': datetime.now(),
                'is_active': True
            }
        ]

        dc_heroes = [
            {
                '_id': 6,
                'username': 'superman',
                'email': 'clark.kent@dc.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Clark',
                'last_name': 'Kent',
                'team_id': 2,
                'hero_name': 'Superman',
                'power': 'Super strength, flight, heat vision',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 7,
                'username': 'batman',
                'email': 'bruce.wayne@dc.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Bruce',
                'last_name': 'Wayne',
                'team_id': 2,
                'hero_name': 'Batman',
                'power': 'Genius intellect, detective skills, wealth',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 8,
                'username': 'wonderwoman',
                'email': 'diana.prince@dc.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Diana',
                'last_name': 'Prince',
                'team_id': 2,
                'hero_name': 'Wonder Woman',
                'power': 'Superhuman strength, Lasso of Truth',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 9,
                'username': 'flash',
                'email': 'barry.allen@dc.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Barry',
                'last_name': 'Allen',
                'team_id': 2,
                'hero_name': 'Flash',
                'power': 'Super speed, time manipulation',
                'created_at': datetime.now(),
                'is_active': True
            },
            {
                '_id': 10,
                'username': 'aquaman',
                'email': 'arthur.curry@dc.com',
                'password': 'pbkdf2_sha256$260000$test',
                'first_name': 'Arthur',
                'last_name': 'Curry',
                'team_id': 2,
                'hero_name': 'Aquaman',
                'power': 'Underwater breathing, marine telepathy',
                'created_at': datetime.now(),
                'is_active': True
            }
        ]

        users_data = marvel_heroes + dc_heroes
        db.users.insert_many(users_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(users_data)} users'))

        # Update team member counts
        db.teams.update_one({'_id': 1}, {'$set': {'member_count': len(marvel_heroes)}})
        db.teams.update_one({'_id': 2}, {'$set': {'member_count': len(dc_heroes)}})

        # Create Activities
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'Boxing', 'Rock Climbing']
        activities_data = []
        activity_id = 1

        for user in users_data:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                days_ago = random.randint(0, 30)
                activity_date = datetime.now() - timedelta(days=days_ago)
                
                activities_data.append({
                    '_id': activity_id,
                    'user_id': user['_id'],
                    'username': user['username'],
                    'hero_name': user['hero_name'],
                    'team_id': user['team_id'],
                    'activity_type': random.choice(activity_types),
                    'duration_minutes': random.randint(20, 120),
                    'calories_burned': random.randint(100, 800),
                    'distance_km': round(random.uniform(1.0, 15.0), 2),
                    'date': activity_date,
                    'notes': f'{user["hero_name"]} training session'
                })
                activity_id += 1

        db.activities.insert_many(activities_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities_data)} activities'))

        # Create Leaderboard entries
        leaderboard_data = []
        for user in users_data:
            user_activities = [a for a in activities_data if a['user_id'] == user['_id']]
            total_calories = sum(a['calories_burned'] for a in user_activities)
            total_distance = sum(a['distance_km'] for a in user_activities)
            total_duration = sum(a['duration_minutes'] for a in user_activities)
            
            leaderboard_data.append({
                '_id': user['_id'],
                'user_id': user['_id'],
                'username': user['username'],
                'hero_name': user['hero_name'],
                'team_id': user['team_id'],
                'team_name': 'Team Marvel' if user['team_id'] == 1 else 'Team DC',
                'total_activities': len(user_activities),
                'total_calories': total_calories,
                'total_distance_km': round(total_distance, 2),
                'total_duration_minutes': total_duration,
                'rank': 0,
                'last_updated': datetime.now()
            })

        # Sort by total calories and assign ranks
        leaderboard_data.sort(key=lambda x: x['total_calories'], reverse=True)
        for idx, entry in enumerate(leaderboard_data, 1):
            entry['rank'] = idx

        db.leaderboard.insert_many(leaderboard_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_data)} leaderboard entries'))

        # Create Workouts (suggested workout plans)
        workouts_data = [
            {
                '_id': 1,
                'name': 'Super Soldier Training',
                'description': 'Captain America\'s intense workout routine',
                'difficulty': 'Advanced',
                'duration_minutes': 60,
                'exercises': [
                    {'name': 'Push-ups', 'sets': 5, 'reps': 50},
                    {'name': 'Pull-ups', 'sets': 5, 'reps': 20},
                    {'name': 'Running', 'duration_minutes': 30},
                    {'name': 'Core exercises', 'sets': 3, 'reps': 30}
                ],
                'recommended_for': ['Strength', 'Endurance'],
                'created_at': datetime.now()
            },
            {
                '_id': 2,
                'name': 'Asgardian Strength Training',
                'description': 'Thor\'s legendary workout for gods',
                'difficulty': 'Expert',
                'duration_minutes': 90,
                'exercises': [
                    {'name': 'Deadlifts', 'sets': 5, 'reps': 10},
                    {'name': 'Hammer swings', 'sets': 4, 'reps': 20},
                    {'name': 'Battle rope', 'duration_minutes': 15},
                    {'name': 'Overhead press', 'sets': 5, 'reps': 12}
                ],
                'recommended_for': ['Strength', 'Power'],
                'created_at': datetime.now()
            },
            {
                '_id': 3,
                'name': 'Spy Agility Training',
                'description': 'Black Widow\'s agility and flexibility routine',
                'difficulty': 'Intermediate',
                'duration_minutes': 45,
                'exercises': [
                    {'name': 'Yoga flow', 'duration_minutes': 20},
                    {'name': 'Jump rope', 'duration_minutes': 10},
                    {'name': 'Martial arts practice', 'duration_minutes': 15}
                ],
                'recommended_for': ['Agility', 'Flexibility'],
                'created_at': datetime.now()
            },
            {
                '_id': 4,
                'name': 'Kryptonian Power Workout',
                'description': 'Superman\'s high-intensity training',
                'difficulty': 'Expert',
                'duration_minutes': 75,
                'exercises': [
                    {'name': 'Bench press', 'sets': 5, 'reps': 15},
                    {'name': 'Squats', 'sets': 5, 'reps': 20},
                    {'name': 'Box jumps', 'sets': 4, 'reps': 15},
                    {'name': 'Plank', 'duration_minutes': 5}
                ],
                'recommended_for': ['Strength', 'Power', 'Endurance'],
                'created_at': datetime.now()
            },
            {
                '_id': 5,
                'name': 'Dark Knight Training',
                'description': 'Batman\'s tactical fitness routine',
                'difficulty': 'Advanced',
                'duration_minutes': 60,
                'exercises': [
                    {'name': 'Parkour training', 'duration_minutes': 20},
                    {'name': 'Martial arts drills', 'duration_minutes': 20},
                    {'name': 'Stealth exercises', 'duration_minutes': 20}
                ],
                'recommended_for': ['Agility', 'Strength', 'Tactics'],
                'created_at': datetime.now()
            },
            {
                '_id': 6,
                'name': 'Speedster Cardio Blast',
                'description': 'Flash\'s speed and endurance training',
                'difficulty': 'Intermediate',
                'duration_minutes': 40,
                'exercises': [
                    {'name': 'Sprint intervals', 'sets': 10, 'duration_minutes': 1},
                    {'name': 'High knees', 'sets': 5, 'reps': 50},
                    {'name': 'Burpees', 'sets': 5, 'reps': 20}
                ],
                'recommended_for': ['Speed', 'Cardio', 'Endurance'],
                'created_at': datetime.now()
            },
            {
                '_id': 7,
                'name': 'Amazon Warrior Training',
                'description': 'Wonder Woman\'s combat conditioning',
                'difficulty': 'Advanced',
                'duration_minutes': 70,
                'exercises': [
                    {'name': 'Sword training', 'duration_minutes': 20},
                    {'name': 'Shield work', 'duration_minutes': 20},
                    {'name': 'Combat drills', 'duration_minutes': 30}
                ],
                'recommended_for': ['Strength', 'Combat', 'Endurance'],
                'created_at': datetime.now()
            },
            {
                '_id': 8,
                'name': 'Atlantean Swimming',
                'description': 'Aquaman\'s underwater fitness program',
                'difficulty': 'Intermediate',
                'duration_minutes': 50,
                'exercises': [
                    {'name': 'Swimming laps', 'duration_minutes': 30},
                    {'name': 'Underwater resistance training', 'duration_minutes': 15},
                    {'name': 'Breath control', 'duration_minutes': 5}
                ],
                'recommended_for': ['Swimming', 'Endurance', 'Breathing'],
                'created_at': datetime.now()
            }
        ]

        db.workouts.insert_many(workouts_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts_data)} workouts'))

        # Print summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams: {db.teams.count_documents({})}')
        self.stdout.write(f'Users: {db.users.count_documents({})}')
        self.stdout.write(f'Activities: {db.activities.count_documents({})}')
        self.stdout.write(f'Leaderboard entries: {db.leaderboard.count_documents({})}')
        self.stdout.write(f'Workouts: {db.workouts.count_documents({})}')
        self.stdout.write(self.style.SUCCESS('\nDatabase successfully populated with superhero data!'))

        client.close()
