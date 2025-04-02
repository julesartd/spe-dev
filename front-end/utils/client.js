import {getToken} from "./auth.js";

const BASE_URL = import.meta.env.VITE_API_URL;

function ApiClient() {
    if (!(this instanceof ApiClient)) {
        return new ApiClient();
    }
    this.baseUrl = BASE_URL + "/api/";
    this.token = null;
}

ApiClient.prototype.setToken = function (token) {
    this.token = token;
};

ApiClient.prototype.get = async function (endpoint) {
    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
            },
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

ApiClient.prototype.post = async function (endpoint, data) {
    const isFormData = data instanceof FormData;
    let token = getToken()
    console.log(token)
    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: isFormData
                ? token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined
                : {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            body: isFormData ? data : JSON.stringify(data),
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur POST:', error);
        throw error;
    }
};

export const apiClient = new ApiClient();
