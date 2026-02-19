import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: 'running',
    duration: '',
    distance: '',
    calories: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      console.log('Fetching activities from API endpoint: /api/activities/my_activities/');
      const data = await api.getMyActivities();
      console.log('Activities data received:', data);
      
      // Handle both paginated (.results) and plain array responses
      const activitiesArray = Array.isArray(data) ? data : (data?.results || []);
      console.log('Processed activities array:', activitiesArray);
      
      setActivities(activitiesArray);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createActivity(formData);
      setShowForm(false);
      setFormData({
        activity_type: 'running',
        duration: '',
        distance: '',
        calories: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchActivities();
    } catch (err) {
      console.error('Error creating activity:', err);
      alert('Failed to log activity. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="activities">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Activities</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Log New Activity'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>Log New Activity</h4>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Activity Type</label>
                  <select 
                    className="form-select" 
                    name="activity_type"
                    value={formData.activity_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="running">Running</option>
                    <option value="walking">Walking</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="strength_training">Strength Training</option>
                    <option value="yoga">Yoga</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input 
                    type="date" 
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Duration (minutes)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Distance (km)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-control"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Calories</label>
                  <input 
                    type="number" 
                    className="form-control"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea 
                  className="form-control"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Log Activity</button>
            </form>
          </div>
        </div>
      )}

      <div className="activities-list">
        {activities.length === 0 ? (
          <div className="alert alert-info">
            No activities logged yet. Start tracking your workouts!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity Type</th>
                  <th>Duration</th>
                  <th>Distance</th>
                  <th>Calories</th>
                  <th>Points</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
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
                      <td>{activity.calories || '-'}</td>
                      <td>
                        <span className="badge bg-success">{activity.points_earned} pts</span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {activity.notes ? (activity.notes.length > 50 ? activity.notes.substring(0, 50) + '...' : activity.notes) : '-'}
                        </small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Activities;
