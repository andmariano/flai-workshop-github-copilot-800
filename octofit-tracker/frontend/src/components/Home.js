import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome to OctoFit Tracker! 🏃</h1>
        <p className="lead">
          Track your fitness journey, compete with friends, and achieve your goals!
        </p>
        <hr className="my-4" />
        <p>
          OctoFit Tracker helps you log activities, join teams, participate in challenges,
          and get personalized workout suggestions tailored to your fitness level.
        </p>
        <Link className="btn btn-primary btn-lg" to="/dashboard" role="button">
          Get Started
        </Link>
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <Link to="/users" className="text-decoration-none">
            <div className="card h-100 card-hover">
              <div className="card-body text-center">
                <h3>👥 Users</h3>
                <p className="card-text">
                  View all users, their profiles, and fitness levels in the community.
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/activities" className="text-decoration-none">
            <div className="card h-100 card-hover">
              <div className="card-body text-center">
                <h3>📊 Activities</h3>
                <p className="card-text">
                  Log your workouts, monitor progress, and earn points for staying active.
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/leaderboard" className="text-decoration-none">
            <div className="card h-100 card-hover">
              <div className="card-body text-center">
                <h3>🏆 Leaderboard</h3>
                <p className="card-text">
                  See how you rank among other users and teams in the community.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h4>🎯 Personalized Workouts</h4>
              <p className="card-text">
                Get workout suggestions tailored to your fitness level and preferences.
              </p>
              <Link to="/workouts" className="btn btn-outline-primary">
                View Workouts
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h4>📈 View Leaderboard</h4>
              <p className="card-text">
                See how you rank among other users and teams in the community.
              </p>
              <Link to="/leaderboard" className="btn btn-outline-primary">
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
