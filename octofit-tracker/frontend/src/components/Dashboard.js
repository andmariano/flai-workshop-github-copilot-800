import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            <div className="alert alert-info">
              No activities yet. Start logging your workouts!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Distance</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => {
                    // Safely parse date
                    let formattedDate = '-';
                    if (activity.date) {
                      try {
                        const dateObj = new Date(activity.date);
                        if (!isNaN(dateObj.getTime())) {
                          formattedDate = dateObj.toLocaleDateString();
                        }
                      } catch (error) {
                        console.error('Error parsing date:', error, activity.date);
                      }
                    }
                    
                    return (
                      <tr key={activity._id}>
                        <td>{formattedDate}</td>
                        <td>
                          <span className="badge bg-primary text-capitalize">
                            {activity.activity_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{activity.duration} min</td>
                        <td>{activity.distance ? `${activity.distance} km` : '-'}</td>
                        <td>
                          <span className="badge bg-success">{activity.points_earned} pts</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <h4>Quick Actions</h4>
          <div className="d-grid gap-2">
            <Link to="/activities" className="btn btn-primary">Log Activity</Link>
            <Link to="/teams" className="btn btn-outline-primary">View Teams</Link>
            <Link to="/challenges" className="btn btn-outline-primary">Browse Challenges</Link>
            <Link to="/workouts" className="btn btn-outline-primary">Get Workout Suggestions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
