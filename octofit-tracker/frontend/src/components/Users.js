import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from API endpoint: /api/users/');
      const data = await api.getUsers();
      console.log('Users data received:', data);
      
      // Handle both paginated (.results) and plain array responses
      const usersArray = Array.isArray(data) ? data : (data?.results || []);
      console.log('Processed users array:', usersArray);
      
      setUsers(usersArray);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="users">
      <h2 className="mb-4">Users 👥</h2>

      {users.length === 0 ? (
        <div className="alert alert-info">
          No users found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Fitness Level</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Bio</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>
                      {user.first_name || user.last_name 
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : '-'}
                    </strong>
                  </td>
                  <td>
                    <span className="badge bg-info">{user.username}</span>
                  </td>
                  <td>{user.email || '-'}</td>
                  <td>
                    {user.profile?.fitness_level ? (
                      <span className="badge bg-primary text-capitalize">
                        {user.profile.fitness_level}
                      </span>
                    ) : (
                      <span className="text-muted">Not set</span>
                    )}
                  </td>
                  <td>{user.profile?.height ? `${user.profile.height} cm` : '-'}</td>
                  <td>{user.profile?.weight ? `${user.profile.weight} kg` : '-'}</td>
                  <td>
                    <small className="text-muted">
                      {user.profile?.bio ? (
                        user.profile.bio.length > 50 
                          ? user.profile.bio.substring(0, 50) + '...' 
                          : user.profile.bio
                      ) : '-'}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;
