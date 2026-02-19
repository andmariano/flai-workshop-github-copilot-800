import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, activitiesData] = await Promise.all([
        api.getActivitySummary(),
        api.getMyActivities()
      ]);
      setSummary(summaryData);
      setRecentActivities(activitiesData.slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        <h4 className="alert-heading">Dashboard Demo Mode</h4>
        <p>This is a demo view. Connect to backend to see real data.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="mb-4">My Dashboard</h2>
      
      {summary && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Activities</h5>
                <h2>{summary.total_activities}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Total Points</h5>
                <h2>{summary.total_points}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Duration (min)</h5>
                <h2>{summary.total_duration}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Distance (km)</h5>
                <h2>{summary.total_distance?.toFixed(1) || 0}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <h4>Recent Activities</h4>
          {recentActivities.length === 0 ? (
            <p className="text-muted">No activities yet. Start logging your workouts!</p>
          ) : (
            <div className="list-group">
              {recentActivities.map((activity) => (
                <div key={activity._id} className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{activity.activity_type}</h5>
                    <small>{new Date(activity.date).toLocaleDateString()}</small>
                  </div>
                  <p className="mb-1">
                    Duration: {activity.duration} min | Points: {activity.points_earned}
                    {activity.distance && ` | Distance: ${activity.distance} km`}
                  </p>
                  {activity.notes && <small className="text-muted">{activity.notes}</small>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-4">
          <h4>Quick Actions</h4>
          <div className="d-grid gap-2">
            <a href="/activities" className="btn btn-primary">Log Activity</a>
            <a href="/teams" className="btn btn-outline-primary">View Teams</a>
            <a href="/challenges" className="btn btn-outline-primary">Browse Challenges</a>
            <a href="/workouts" className="btn btn-outline-primary">Get Workout Suggestions</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
