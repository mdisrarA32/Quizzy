const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    const user = JSON.parse(localStorage.getItem('quizzy-user'));
    const headers = {
        'Content-Type': 'application/json',
    };
    if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }
    return headers;
};

export const api = {
    // Auth
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    register: async (username, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    },

    // Quiz
    submitScore: async (scoreData) => {
        const response = await fetch(`${API_URL}/quiz/submit-score`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(scoreData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to submit score');
        return data;
    },

    getLeaderboard: async (category = '') => {
        const url = category
            ? `${API_URL}/quiz/leaderboard?category=${category}`
            : `${API_URL}/quiz/leaderboard`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch leaderboard');
        return data;
    },

    getMyScores: async () => {
        const response = await fetch(`${API_URL}/quiz/my-scores`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch scores');
        return data;
    },

    // Profile
    getProfile: async () => {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
        return data;
    },
};
