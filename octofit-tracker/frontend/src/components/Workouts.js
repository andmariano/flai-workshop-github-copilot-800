import React, { useState, useEffect } from 'react';
import api from '../services/api';

// API Endpoint: https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/
// Component for displaying workout suggestions from the Django REST API

function Workouts() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fitness_level: '',
    activity_type: ''
  });

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkoutSuggestions();
      setSuggestions(data);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkoutSuggestions(filters);
      setSuggestions(data);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="workouts">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💪 Workout Suggestions</h2>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filter Workouts</h5>
          <div className="row g-3">
            <div className="col-md-4">
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
            <div className="col-md-4">
              <label className="form-label">Activity Type</label>
              <select
                className="form-select"
                name="activity_type"
                value={filters.activity_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="running">Running</option>
                <option value="strength_training">Strength Training</option>
                <option value="yoga">Yoga</option>
                <option value="cycling">Cycling</option>
                <option value="swimming">Swimming</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Cards */}
      <div className="row">
        {suggestions.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No workout suggestions found matching your criteria.
            </div>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div key={suggestion._id || suggestion.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{suggestion.title || suggestion.name}</h5>
                  <div className="mb-3">
                    <span className={`badge bg-${
                      (suggestion.fitness_level || suggestion.difficulty) === 'beginner' || (suggestion.fitness_level || suggestion.difficulty) === 'Beginner' ? 'success' :
                      (suggestion.fitness_level || suggestion.difficulty) === 'intermediate' || (suggestion.fitness_level || suggestion.difficulty) === 'Intermediate' ? 'warning' :
                      'danger'
                    } me-2`}>
                      {suggestion.fitness_level || suggestion.difficulty || 'N/A'}
                    </span>
                    <span className="badge bg-info">
                      {suggestion.duration || suggestion.duration_minutes} min
                    </span>
                    {(suggestion.activity_type || suggestion.recommended_for) && (
                      <span className="badge bg-secondary ms-2">
                        {suggestion.activity_type || (Array.isArray(suggestion.recommended_for) ? suggestion.recommended_for[0] : suggestion.recommended_for)}
                      </span>
                    )}
                  </div>
                  <p className="card-text">{suggestion.description}</p>
                  
                  {suggestion.exercises && Array.isArray(suggestion.exercises) && suggestion.exercises.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-muted">Exercises:</h6>
                      <ul className="list-unstyled">
                        {suggestion.exercises.map((exercise, idx) => (
                          <li key={idx} className="mb-1">
                            <small>
                              • {exercise.name}: {exercise.sets && exercise.reps ? `${exercise.sets}×${exercise.reps}` : 
                                exercise.duration_minutes ? `${exercise.duration_minutes} min` : 'As prescribed'}
                            </small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {suggestion.instructions && (
                    <div className="mt-3">
                      <h6 className="text-muted">Instructions:</h6>
                      <p className="small">{suggestion.instructions}</p>
                    </div>
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

export default Workouts;
