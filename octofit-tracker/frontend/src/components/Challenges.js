import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActive, setShowActive] = useState(true);

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
      return '-';
    } catch (error) {
      console.error('Error parsing date:', error, dateString);
      return '-';
    }
  };

  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActive]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const params = showActive ? { active: 'true' } : {};
      const [allChallenges, userChallenges] = await Promise.all([
        api.getChallenges(params),
        api.getMyChallenges()
      ]);
      setChallenges(allChallenges);
      setMyChallenges(userChallenges);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setChallenges([]);
      setMyChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await api.joinChallenge(challengeId);
      fetchChallenges();
    } catch (err) {
      console.error('Error joining challenge:', err);
      alert('Failed to join challenge. Please try again.');
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    if (window.confirm('Are you sure you want to leave this challenge?')) {
      try {
        await api.leaveChallenge(challengeId);
        fetchChallenges();
      } catch (err) {
        console.error('Error leaving challenge:', err);
        alert('Failed to leave challenge. Please try again.');
      }
    }
  };

  const isInChallenge = (challengeId) => {
    return myChallenges.some(challenge => challenge.id === challengeId);
  };

  const getChallengeTypeLabel = (type) => {
    const labels = {
      'distance': 'Distance',
      'duration': 'Duration',
      'frequency': 'Frequency',
      'points': 'Points'
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="challenges">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Challenges</h2>
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${showActive ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowActive(true)}
          >
            Active
          </button>
          <button 
            type="button" 
            className={`btn ${!showActive ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowActive(false)}
          >
            All
          </button>
        </div>
      </div>

      {myChallenges.length > 0 && (
        <div className="mb-5">
          <h4>My Active Challenges</h4>
          <div className="row">
            {myChallenges.map((challenge) => (
              <div key={challenge.id} className="col-md-6 mb-3">
                <div className="card border-success">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{challenge.title}</h5>
                      <span className="badge bg-success">{challenge.points_reward} pts</span>
                    </div>
                    <p className="card-text">{challenge.description}</p>
                    <p className="text-muted mb-2">
                      <strong>Type:</strong> {getChallengeTypeLabel(challenge.challenge_type)}<br />
                      <strong>Target:</strong> {challenge.target_value}<br />
                      <strong>Period:</strong> {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-info">{challenge.participant_count} participants</span>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleLeaveChallenge(challenge.id)}
                      >
                        Leave Challenge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h4>{showActive ? 'Active Challenges' : 'All Challenges'}</h4>
      <div className="row">
        {challenges.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No challenges available at the moment. Check back soon!
            </div>
          </div>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{challenge.title}</h5>
                    <span className="badge bg-primary">{challenge.points_reward} pts</span>
                  </div>
                  <p className="card-text">{challenge.description}</p>
                  <p className="text-muted mb-2">
                    <strong>Type:</strong> {getChallengeTypeLabel(challenge.challenge_type)}<br />
                    <strong>Target:</strong> {challenge.target_value}<br />
                    <strong>Period:</strong> {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-info">{challenge.participant_count} participants</span>
                    {isInChallenge(challenge.id) ? (
                      <span className="badge bg-success">Participating</span>
                    ) : (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleJoinChallenge(challenge.id)}
                      >
                        Join Challenge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Challenges;
