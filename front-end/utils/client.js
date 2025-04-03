import {getToken} from "./auth.js";

const BASE_URL = import.meta.env.VITE_API_URL;

function ApiClient() {
    if (!(this instanceof ApiClient)) {
        return new ApiClient();
    }
    this.baseUrl = BASE_URL + "/api/";
}

ApiClient.prototype.get = async function (endpoint) {
    try {
        const token = getToken();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
    let token = getToken()
    console.log(token)
    return await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: isFormData
            ? token
                ? {Authorization: `Bearer ${token}`}
                : undefined
            : {
                'Content-Type': 'application/json',
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
            },
        body: isFormData ? data : JSON.stringify(data),
    });
};

ApiClient.prototype.put = async function (endpoint, data) {
    const isFormData = data instanceof FormData;
    let token = getToken()
    console.log(token)
    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
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

}

ApiClient.prototype.delete = async function (endpoint) {
    const token = getToken();

    try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP DELETE error: ${response.status} - ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return { success: true }; // fallback si pas de contenu
        }

    } catch (error) {
        console.error("Erreur DELETE:", error);
        throw error;
    }
};



export const apiClient = new ApiClient();
