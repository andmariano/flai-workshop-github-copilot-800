import React from 'react';

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
        <a className="btn btn-primary btn-lg" href="/dashboard" role="button">
          Get Started
        </a>
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3>📊 Track Activities</h3>
              <p className="card-text">
                Log your workouts, monitor progress, and earn points for staying active.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3>👥 Join Teams</h3>
              <p className="card-text">
                Create or join teams, compete together, and motivate each other to stay fit.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3>🏆 Compete</h3>
              <p className="card-text">
                Participate in challenges, climb the leaderboard, and earn achievements.
              </p>
            </div>
          </div>
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
              <a href="/workouts" className="btn btn-outline-primary">
                View Workouts
              </a>
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
              <a href="/leaderboard" className="btn btn-outline-primary">
                View Leaderboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
