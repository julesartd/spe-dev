const BASE_URL = 'http://localhost:5000/api/';

function ApiClient() {
    if (!(this instanceof ApiClient)) {
        return new ApiClient();
    }
    this.baseUrl = BASE_URL;
}

ApiClient.prototype.get = async function(endpoint) {
    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur GET:', error);
        throw error;
    }
};

ApiClient.prototype.post = async function(endpoint, data) {
    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur POST:', error);
        throw error;
    }
};

export const apiClient = new ApiClient();