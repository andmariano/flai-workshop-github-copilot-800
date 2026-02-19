// API service for OctoFit Tracker

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User endpoints
  getUsers() {
    return this.request('/users/');
  }

  getUser(id) {
    return this.request(`/users/${id}/`);
  }

  // Profile endpoints
  getProfile(id) {
    return this.request(`/profiles/${id}/`);
  }

  getMyProfile() {
    return this.request('/profiles/me/');
  }

  updateMyProfile(data) {
    return this.request('/profiles/update_me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Activity endpoints
  getActivities(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/activities/${queryString ? `?${queryString}` : ''}`);
  }

  getActivity(id) {
    return this.request(`/activities/${id}/`);
  }

  createActivity(data) {
    return this.request('/activities/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMyActivities() {
    return this.request('/activities/my_activities/');
  }

  getActivitySummary() {
    return this.request('/activities/summary/');
  }

  // Team endpoints
  getTeams() {
    return this.request('/teams/');
  }

  getTeam(id) {
    return this.request(`/teams/${id}/`);
  }

  createTeam(data) {
    return this.request('/teams/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  joinTeam(id) {
    return this.request(`/teams/${id}/join/`, {
      method: 'POST',
    });
  }

  leaveTeam(id) {
    return this.request(`/teams/${id}/leave/`, {
      method: 'POST',
    });
  }

  getMyTeams() {
    return this.request('/teams/my_teams/');
  }

  // Challenge endpoints
  getChallenges(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/challenges/${queryString ? `?${queryString}` : ''}`);
  }

  getChallenge(id) {
    return this.request(`/challenges/${id}/`);
  }

  joinChallenge(id) {
    return this.request(`/challenges/${id}/join/`, {
      method: 'POST',
    });
  }

  leaveChallenge(id) {
    return this.request(`/challenges/${id}/leave/`, {
      method: 'POST',
    });
  }

  getMyChallenges() {
    return this.request('/challenges/my_challenges/');
  }

  // Workout suggestion endpoints
  getWorkoutSuggestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/workouts/${queryString ? `?${queryString}` : ''}`);
  }

  getWorkoutSuggestion(id) {
    return this.request(`/workouts/${id}/`);
  }

  getWorkoutsForMe() {
    return this.request('/workouts/for_me/');
  }

  // Leaderboard endpoints
  getLeaderboard(limit = 10) {
    return this.request(`/leaderboard/?limit=${limit}`);
  }

  getTeamLeaderboard(limit = 10) {
    return this.request(`/team-leaderboard/?limit=${limit}`);
  }
}

const apiService = new ApiService();
export default apiService;
