import React, { useState, useEffect } from 'react';
import api from '../services/api';

function WorkoutSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fitness_level: '',
    activity_type: ''
  });

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkoutSuggestions(filters);
      setSuggestions(data);
    } catch (err) {
      console.error('Error fetching workout suggestions:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      fitness_level: '',
      activity_type: ''
    });
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="workout-suggestions">
      <h2 className="mb-4">Workout Suggestions 💪</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Filters</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Fitness Level</label>
              <select 
                className="form-select"
                name="fitness_level"
                value={filters.fitness_level}
                onChange={handleFilterChange}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Activity Type</label>
              <select 
                className="form-select"
                name="activity_type"
                value={filters.activity_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="running">Running</option>
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
                <option value="swimming">Swimming</option>
                <option value="strength_training">Strength Training</option>
                <option value="yoga">Yoga</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-end">
              <button 
                className="btn btn-secondary w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {suggestions.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No workout suggestions found. Try adjusting your filters or complete your profile for personalized recommendations!
            </div>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div key={suggestion._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{suggestion.title}</h5>
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">
                      {suggestion.fitness_level}
                    </span>
                    <span className="badge bg-info">
                      {suggestion.duration} min
                    </span>
                  </div>
                  <p className="card-text">{suggestion.description}</p>
                  <hr />
                  <h6>Instructions:</h6>
                  <p className="card-text small">{suggestion.instructions}</p>
                  {suggestion.video_url && (
                    <a 
                      href={suggestion.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WorkoutSuggestions;
