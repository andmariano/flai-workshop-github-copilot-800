import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      console.log('Fetching teams from API endpoints: /api/teams/ and /api/teams/my_teams/');
      const [allTeams, userTeams] = await Promise.all([
        api.getTeams(),
        api.getMyTeams()
      ]);
      console.log('All teams data received:', allTeams);
      console.log('My teams data received:', userTeams);
      
      // Handle both paginated (.results) and plain array responses
      const teamsArray = Array.isArray(allTeams) ? allTeams : (allTeams?.results || []);
      const myTeamsArray = Array.isArray(userTeams) ? userTeams : (userTeams?.results || []);
      console.log('Processed all teams array:', teamsArray);
      console.log('Processed my teams array:', myTeamsArray);
      
      setTeams(teamsArray);
      setMyTeams(myTeamsArray);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
      setMyTeams([]);
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
      await api.createTeam(formData);
      setShowForm(false);
      setFormData({ name: '', description: '', avatar: '' });
      fetchTeams();
    } catch (err) {
      console.error('Error creating team:', err);
      alert('Failed to create team. Please try again.');
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await api.joinTeam(teamId);
      fetchTeams();
    } catch (err) {
      console.error('Error joining team:', err);
      alert('Failed to join team. Please try again.');
    }
  };

  const handleLeaveTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      try {
        await api.leaveTeam(teamId);
        fetchTeams();
      } catch (err) {
        console.error('Error leaving team:', err);
        alert('Failed to leave team. Please try again.');
      }
    }
  };

  const isInTeam = (teamId) => {
    return myTeams.some(team => team.id === teamId);
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="teams">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teams</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create Team'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>Create New Team</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Avatar URL (optional)</label>
                <input 
                  type="url" 
                  className="form-control"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Team</button>
            </form>
          </div>
        </div>
      )}

      {myTeams.length > 0 && (
        <div className="mb-5">
          <h4>My Teams</h4>
          <div className="row">
            {myTeams.map((team) => (
              <div key={team.id} className="col-md-6 mb-3">
                <div className="card border-primary">
                  <div className="card-body">
                    <h5 className="card-title">{team.name}</h5>
                    <p className="card-text">{team.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-info me-2">{team.member_count || 0} members</span>
                        <span className="badge bg-success">{team.total_points || 0} points</span>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleLeaveTeam(team.id)}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h4>All Teams</h4>
      <div className="row">
        {teams.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No teams available. Create the first one!
            </div>
          </div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="badge bg-info me-2">{team.member_count || 0} members</span>
                      <span className="badge bg-success">{team.total_points || 0} points</span>
                    </div>
                    {isInTeam(team.id) ? (
                      <span className="badge bg-primary">Member</span>
                    ) : (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleJoinTeam(team.id)}
                      >
                        Join Team
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

export default Teams;
