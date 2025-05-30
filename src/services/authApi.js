const API_BASE_URL = 'http://localhost:5275/api'; // Adjust port if needed

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};