import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Leaderboard() {
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      console.log('Fetching leaderboards from API endpoints: /api/leaderboard/ and /api/team-leaderboard/');
      const [users, teams] = await Promise.all([
        api.getLeaderboard(20),
        api.getTeamLeaderboard(20)
      ]);
      console.log('User leaderboard data received:', users);
      console.log('Team leaderboard data received:', teams);
      
      // Handle both paginated (.results) and plain array responses
      const usersArray = Array.isArray(users) ? users : (users?.results || []);
      const teamsArray = Array.isArray(teams) ? teams : (teams?.results || []);
      console.log('Processed user leaderboard array:', usersArray);
      console.log('Processed team leaderboard array:', teamsArray);
      
      setUserLeaderboard(usersArray);
      setTeamLeaderboard(teamsArray);
    } catch (err) {
      console.error('Error fetching leaderboards:', err);
      setUserLeaderboard([]);
      setTeamLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="leaderboard">
      <h2 className="mb-4">Leaderboard 🏆</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Teams
          </button>
        </li>
      </ul>

      {activeTab === 'users' && (
        <div className="user-leaderboard">
          {userLeaderboard.length === 0 ? (
            <div className="alert alert-info">
              No data available yet. Start logging activities to appear on the leaderboard!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Team</th>
                    <th>Activities</th>
                    <th>Total Calories</th>
                    <th>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {userLeaderboard.map((entry) => (
                    <tr key={entry.user_id}>
                      <td><strong>{getRankBadge(entry.rank)}</strong></td>
                      <td>
                        <strong>{entry.username}</strong>
                      </td>
                      <td>
                        {entry.team_name ? (
                          <span className="badge bg-info">{entry.team_name}</span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>{entry.activity_count}</td>
                      <td>{entry.total_calories || 0}</td>
                      <td>
                        <span className="badge bg-success">{entry.total_points} pts</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="team-leaderboard">
          {teamLeaderboard.length === 0 ? (
            <div className="alert alert-info">
              No team data available yet. Create or join a team to compete!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {teamLeaderboard.map((entry) => (
                    <tr key={entry.team_id}>
                      <td><strong>{getRankBadge(entry.rank)}</strong></td>
                      <td>{entry.team_name}</td>
                      <td>{entry.member_count}</td>
                      <td>
                        <span className="badge bg-success">{entry.total_points} pts</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
