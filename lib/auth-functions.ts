import axios from 'axios';
const baseUrl = 'https://payszn-backend.onrender.com';

export const createApiKey = async function (accessToken: string) {
    console.log("This is the api-key-management", accessToken);

    try {
        const response = await axios.post(`${baseUrl}/users/create-api-key`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response)
        return response.data;
    } catch (error: any) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

export const getUserInfo = async function (accessToken: string) {
    try {
        const response = await axios.get(`${baseUrl}/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

export const getUserTransactions = async function (accessToken: string) {
    try {
        const response = await axios.get(`${baseUrl}/users/transactions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching user transactions:', error);
        throw error;
    }
}


export const updateUserTransaction = async function (accessToken: string, body: { webhookUrl?: string, callbackUrl?: string }) {
    try {
        const response = await axios.patch(`${baseUrl}/users`, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error updating user transaction:', error);
        throw error;
    }
}