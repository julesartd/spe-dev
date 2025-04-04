import {getToken} from "./auth.js";

const BASE_URL = import.meta.env.VITE_API_URL;

function ApiClient() {
    if (!(this instanceof ApiClient)) {
        return new ApiClient();
    }
    this.baseUrl = BASE_URL + "/api/";
}

const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

ApiClient.prototype.sanitizeData = function(data) {
    if (data instanceof FormData) {
        const sanitizedFormData = new FormData();
        for (let [key, value] of data.entries()) {
            if (typeof value === 'string') {
                sanitizedFormData.append(key, escapeHtml(value));
            } else {
                sanitizedFormData.append(key, value);
            }
        }
        return sanitizedFormData;
    }

    if (typeof data === 'object') {
        const sanitizedData = {};
        for (let [key, value] of Object.entries(data)) {
            sanitizedData[key] = escapeHtml(value);
        }
        return sanitizedData;
    }

    return escapeHtml(data);
};

ApiClient.prototype.getCSRFToken = async function () {
    try {
        const response = await fetch(`${this.baseUrl}csrf-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include' // Important pour inclure les cookies
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error('Erreur GET CSRF:', error);
        throw error;
    }
};

ApiClient.prototype.get = async function (endpoint) {
    const sanitizedEndpoint = escapeHtml(endpoint);
    try {
        const token = getToken();
        const response = await fetch(`${this.baseUrl}${sanitizedEndpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    let token = getToken();
    let csrfToken = await this.getCSRFToken();
    const sanitizedData = this.sanitizeData(data);

    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: isFormData
                ? {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'X-CSRF-Token': csrfToken
                }
                : {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'X-CSRF-Token': csrfToken
                },
            body: isFormData ? sanitizedData : JSON.stringify(sanitizedData),
        });

        const json = await response.json();
        return {
            status: response.status,
            data: json
        };
    } catch (error) {
        console.error("Erreur POST:", error);
        throw error;
    }
};

ApiClient.prototype.put = async function (endpoint, data) {
    const isFormData = data instanceof FormData;
    let token = getToken();
    let csrfToken = await this.getCSRFToken();
    const sanitizedData = this.sanitizeData(data);

    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: isFormData
                ? {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'X-CSRF-Token': csrfToken
                }
                : {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'X-CSRF-Token': csrfToken
                },
            body: isFormData ? sanitizedData : JSON.stringify(sanitizedData),
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur PUT:', error);
        throw error;
    }
};

ApiClient.prototype.delete = async function (endpoint) {
    const token = getToken();
    const csrfToken = await this.getCSRFToken();
    const sanitizedEndpoint = escapeHtml(endpoint);
    try {
        const response = await fetch(`${this.baseUrl}${sanitizedEndpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'X-CSRF-Token': csrfToken
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP DELETE error: ${response.status} - ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return { success: true };
    } catch (error) {
        console.error("Erreur DELETE:", error);
        throw error;
    }
};



export const apiClient = new ApiClient();
